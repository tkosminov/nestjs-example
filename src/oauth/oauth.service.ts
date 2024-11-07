import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';

import { JwtService } from '../jwt/jwt.service';
import { checkPassword, passwordToHash } from '../utils/bcrypt';
import { authorization_failed, bad_request } from '../utils/errors';
import { RecoveryKey } from './recovery-key/recovery-key.entity';
import { RefreshToken } from './refresh-token/refresh-token.entity';
import { IJwtPayload, User } from './user/user.entity';

export interface IJwtToken {
  iat: number;
  exp: number;
  jti: string;
}

export interface IAccessToken extends IJwtToken {
  current_user: IJwtPayload;
  token_type: 'access';
}

export interface IRefreshToken extends IJwtToken {
  current_user: { id: string };
  token_type: 'refresh';
}

@Injectable()
export class OAuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly data_source: DataSource
  ) {}

  public async registration(username: string, password: string) {
    return this.data_source.transaction(async (entity_manager) => {
      const exist_user = await entity_manager.getRepository(User).findOne({ where: { username: username.trim().toLowerCase() } });

      if (exist_user) {
        throw bad_request();
      }

      const user_dto: DeepPartial<User> = {
        username: username.trim().toLowerCase(),
        encrypted_password: passwordToHash(password),
      };

      const inserted_user = await entity_manager.getRepository(User).insert(user_dto);

      return this.reGenerateRecoveryKeys(entity_manager, inserted_user.identifiers[0].id);
    });
  }

  public async signInByPassword(username: string, password: string) {
    return this.data_source.transaction(async (entity_manager) => {
      const user = await entity_manager.getRepository(User).findOne({ where: { username: username.trim().toLowerCase() } });

      if (!user || !checkPassword(user.encrypted_password, password)) {
        throw authorization_failed();
      }

      return this.generateJwt(entity_manager, user);
    });
  }

  public async signInByRefreshToken(refresh_token: string) {
    return this.data_source.transaction(async (entity_manager) => {
      const { current_user, token_type, jti } = this.jwt.verify<IRefreshToken>(refresh_token, false);

      if (!token_type || token_type !== 'refresh') {
        throw authorization_failed();
      }

      const deleted_token = await entity_manager.getRepository(RefreshToken).delete({ id: jti, user_id: current_user.id });

      if (!deleted_token.affected) {
        throw authorization_failed();
      }

      const user = await entity_manager.getRepository(User).findOne({ where: { id: current_user.id } });

      if (!user) {
        throw authorization_failed();
      }

      return this.generateJwt(entity_manager, user);
    });
  }

  public async changePassword(recovery_key: string, new_password: string) {
    return await this.data_source.transaction(async (entityManager) => {
      const recovery_key_entity = await entityManager.getRepository(RecoveryKey).findOne({ where: { id: recovery_key } });

      if (!recovery_key_entity) {
        throw authorization_failed();
      }

      await entityManager.getRepository(User).update(recovery_key_entity.user_id, { encrypted_password: passwordToHash(new_password) });

      await entityManager.getRepository(RecoveryKey).delete(recovery_key);

      return { message: 'OK' };
    });
  }

  private async generateJwt(entity_manager: EntityManager, user: User) {
    const refresh = await entity_manager.getRepository(RefreshToken).save({ user_id: user.id });

    const access_token = this.jwt.generate({ current_user: user.getJwtPayload(), token_type: 'access' });
    const refresh_token = this.jwt.generate({ current_user: user.getJwtPayload(), token_type: 'refresh' }, refresh.id);

    return {
      access_token,
      refresh_token,
    };
  }

  private async reGenerateRecoveryKeys(entity_manager: EntityManager, user_id: string) {
    await entity_manager.getRepository(RecoveryKey).delete({ user_id });

    const keys: { user_id: string }[] = [];

    for (let i = 0; i < 5; i++) {
      keys.push({ user_id });
    }

    const recovery_keys = (await entity_manager.getRepository(RecoveryKey).save(keys)).map((r: RecoveryKey) => r.id);

    return {
      recovery_keys,
    };
  }
}
