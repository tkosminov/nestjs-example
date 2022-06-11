import { Injectable } from '@nestjs/common';

import { Algorithm, sign } from 'jsonwebtoken';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import config from 'config';
import { nanoid } from 'nanoid';

import { checkPassword, passwordToHash } from '../helpers/password.helper';
import { account_blocked, authorization_failed, bad_request, refresh_token_expired_signature } from '../errors';

import { RefreshToken } from './refresh-token/refresh-token.entity';
import { User } from './user/user.entity';
import { RecoveryKey } from './recovery-key/recovery-key.entity';

const jwt_settings = config.get<IJwtSettings>('JWT_SETTINGS');

@Injectable()
export class OAuthService {
  constructor(private dataSource: DataSource) {}

  public async registration(login: string, password: string) {
    return await this.dataSource.transaction(async (entityManager) => {
      const exist_user = await entityManager.getRepository(User).findOne({ where: { login: login.trim().toLowerCase() } });

      if (exist_user) {
        bad_request({ raise: true, msg: 'LOGIN_ALREADY_EXISTS' });
      }

      const user_obj: DeepPartial<User> = {
        login,
        password: passwordToHash(password),
      };

      const inserted_user = await entityManager.getRepository(User).insert(user_obj);

      return await this.reGenerateRecoveryKeys(entityManager, inserted_user.identifiers[0].id);
    });
  }

  public async signInByPassword(login: string, password: string) {
    return await this.dataSource.transaction(async (entityManager) => {
      const user = await entityManager.getRepository(User).findOne({ where: { login: login.trim().toLowerCase() } });

      if (!user || !checkPassword(user.password, password)) {
        authorization_failed({ raise: true });
      }

      if (user.is_blocked) {
        account_blocked({ raise: true });
      }

      return await this.generetaJwt(entityManager, user);
    });
  }

  public async signInByRefreshToken(refresh_token: string) {
    return await this.dataSource.transaction(async (entityManager) => {
      const current_refresh_token = await entityManager.getRepository(RefreshToken).findOne({ where: { id: refresh_token } });

      if (!current_refresh_token) {
        authorization_failed({ raise: true });
      }

      if (!this.checkExpiresAt(current_refresh_token.expires_at)) {
        refresh_token_expired_signature({ raise: true });
      }

      const user = await entityManager.getRepository(User).findOne({ where: { id: current_refresh_token.user_id } });

      if (user.is_blocked) {
        account_blocked({ raise: true });
      }

      return await this.generetaJwt(entityManager, user);
    });
  }

  public async changePassword(recovery_key: string, new_password: string) {
    return await this.dataSource.transaction(async (entityManager) => {
      const recovery_key_entity = await entityManager.getRepository(RecoveryKey).findOne({ where: { id: recovery_key } });

      if (!recovery_key_entity) {
        authorization_failed({ raise: true });
      }

      await entityManager.getRepository(User).update(recovery_key_entity.user_id, { password: passwordToHash(new_password) });

      await entityManager.getRepository(RecoveryKey).delete(recovery_key);

      return { message: 'OK' };
    });
  }

  private checkExpiresAt(date: Date) {
    return new Date(date).toISOString() > new Date().toISOString();
  }

  private async generetaJwt(entityManager: EntityManager, user: User) {
    const refresh_token = await entityManager.getRepository(RefreshToken).save({
      user_id: user.id,
      expires_at: new Date(new Date().setDate(new Date().getDate() + jwt_settings.refreshTokenExpiresIn)),
    });

    const jwt_token = sign(user.json_for_jwt(), jwt_settings.secretKey, {
      jwtid: nanoid(16),
      expiresIn: `${jwt_settings.tokenExpiresIn}m`,
      algorithm: jwt_settings.algorithm as Algorithm,
    });

    return {
      token: jwt_token,
      token_type: 'jwt',
      token_expires_at: new Date(new Date().setMinutes(new Date().getMinutes() + jwt_settings.tokenExpiresIn)).toISOString(),
      refresh_token: refresh_token.id,
      refresh_token_expires_at: refresh_token.expires_at,
    };
  }

  public async reGenerateRecoveryKeys(entityManager: EntityManager, user_id: string) {
    await entityManager.getRepository(RecoveryKey).delete({ user_id });

    const keys = [];

    for (let i = 0; i < 5; i++) {
      keys.push({ user_id: user_id });
    }

    return (await entityManager.getRepository(RecoveryKey).save(keys)).map((r: RecoveryKey) => r.id);
  }
}
