import { Injectable } from '@nestjs/common';

import config from 'config';
import { Algorithm, verify, sign } from 'jsonwebtoken';

import { RefreshToken } from './refresh_token/refresh_token.entity';

import { RefreshTokenService } from './refresh_token/refresh_token.service';
import { UserService } from './user/user.service';

import { IPayload } from './interface/payload.interface';

import { AuthorizationDTO } from './dto/authorization.dto';
import { PasswordDTO } from './dto/password.dto';
import { RefreshDTO } from './dto/refresh.dto';

import {
  refresh_token_expired_signature,
  unauthorized,
} from '../common/errors';
import { checkPassword } from '../common/helpers/password.helper';

const jwtSettings = config.get<IJwtSettings>('JWT_SETTINGS');

@Injectable()
export class OAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public async signInByPassword(userCredentials: PasswordDTO) {
    const user = await this.userService.findOneBy({
      email: userCredentials.email,
    });

    if (!user || !checkPassword(user.password, userCredentials.password)) {
      unauthorized({ raise: true });
    }

    const refreshToken = await this.refreshTokenService.newModel({ user });

    return await this.createJWT(refreshToken);
  }

  public async signInByAuthorizationCode(authCredentials: AuthorizationDTO) {
    const user = await this.userService.findOneBy({
      authorizationCode: authCredentials.authorizationCode,
    });

    if (!user) {
      unauthorized({ raise: true });
    }

    const refreshToken = await this.refreshTokenService.newModel({ user });

    return await this.createJWT(refreshToken);
  }

  public async signInByRefreshToken(authCredentials: RefreshDTO) {
    const oldRefreshToken = await this.refreshTokenService.findOneBy(
      {
        refreshToken: authCredentials.refreshToken,
      },
      ['user'],
    );

    if (
      !oldRefreshToken ||
      !this.checkExpiresAt(oldRefreshToken.refreshTokenExpiresAt)
    ) {
      refresh_token_expired_signature({ raise: true });
    }

    const refreshToken = await this.refreshTokenService.newModel({
      user: oldRefreshToken.user,
    });

    await this.refreshTokenService.delete(oldRefreshToken.id);

    return await this.createJWT(refreshToken);
  }

  private async createJWT(refreshToken: RefreshToken) {
    const updatedRefreshToken = await this.refreshTokenService.save(
      refreshToken,
    );

    const jwtToken = sign(
      updatedRefreshToken.user.jwtPayload(),
      jwtSettings.secretKey,
      {
        expiresIn: `${jwtSettings.expiresIn}m`,
      },
    );

    return {
      token_type: 'jwt',
      jwt_token: jwtToken,
      expires_in: new Date(
        new Date().setMinutes(new Date().getMinutes() + jwtSettings.expiresIn),
      ).toISOString(),
      refresh_token: updatedRefreshToken.refreshToken,
      refresh_token_expires_at: updatedRefreshToken.refreshTokenExpiresAt,
    };
  }

  private checkExpiresAt(expiresAt: Date) {
    return new Date(expiresAt).toISOString() > new Date().toISOString();
  }

  public verifyToken(token: string) {
    return verify(token, jwtSettings.secretKey, {
      algorithms: jwtSettings.algorithms as Algorithm[],
    }) as IPayload;
  }

  public async validateUser(payload: IPayload) {
    return await this.userService.findOne(payload.id);
  }
}
