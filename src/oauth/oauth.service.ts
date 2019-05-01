import { Injectable, UnauthorizedException } from '@nestjs/common';

import config from 'config';
import jwt from 'jsonwebtoken';

import { Auth } from './auth/auth.entity';

import { UserService } from '../core/user/user.service';
import { AuthService } from './auth/auth.service';
import { ClientService } from './client/client.service';

import { IJwtPayload } from './interface/jwt-payload.iterface';

import { AuthorizationDTO } from './dto/authorization.dto';
import { ClientDTO } from './dto/client.dto';
import { PasswordDTO } from './dto/password.dto';
import { RefreshDTO } from './dto/refresh.dto';

import { passwordToHash } from '../common/helpers/pswd.helper';

const jwtSettings = config.get<IJwtSettings>('JWT_SETTINGS');

@Injectable()
export class OAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly clientService: ClientService
  ) {}

  public async signInByPassword(userCredentials: PasswordDTO, clientCredentials: ClientDTO) {
    const client = await this.checkClient(clientCredentials);
    const user = await this.userService.findOneBy({
      email: userCredentials.email,
      password: passwordToHash(userCredentials.password),
    });

    if (!user) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    let auth = await this.authService.findOneBy({ client, user }, ['client', 'user']);

    if (!auth) {
      auth = await this.authService.newModel({ client, user });
    }

    return await this.createJWT(auth);
  }

  public async signInByAuthorizationCode(authCredentials: AuthorizationDTO, clientCredentials: ClientDTO) {
    const client = await this.checkClient(clientCredentials);
    const auth = await this.authService.findOneBy(
      {
        client,
        authorizationCode: authCredentials.authorizationCode,
      },
      ['client', 'user']
    );

    if (!auth) {
      throw new UnauthorizedException(`Invalid authorizationCode`);
    }

    return await this.createJWT(auth);
  }

  public async signInByRefreshToken(authCredentials: RefreshDTO, clientCredentials: ClientDTO) {
    const client = await this.checkClient(clientCredentials);
    const auth = await this.authService.findOneBy(
      {
        client,
        refreshToken: authCredentials.refreshToken,
      },
      ['client', 'user']
    );

    if (!auth || !this.checkExpiresAt(auth.refreshTokenExpiresAt)) {
      throw new UnauthorizedException(`Invalid refreshToken`);
    }

    return await this.createJWT(auth);
  }

  // tslint:disable-next-line: no-feature-envy
  private async createJWT(auth: Auth) {
    const updatedAuth = await this.authService.save(auth);

    const jwtToken = jwt.sign(updatedAuth.user.jwtPayload(), jwtSettings.secretKey, {
      expiresIn: jwtSettings.expiresIn,
    });

    return {
      expires_in: jwtSettings.expiresIn,
      refresh_token: updatedAuth.refreshToken,
      jwt_token: jwtToken,
      token_type: 'bearer',
    };
  }

  private async checkClient(clientCredentials: ClientDTO) {
    const client = await this.clientService.findOneBy(clientCredentials);

    if (!client) {
      throw new UnauthorizedException(`Invalid clientId or clientSecret`);
    }

    return client;
  }

  private checkExpiresAt(expiresAt: Date) {
    return new Date(expiresAt).toISOString() > new Date().toISOString();
  }

  public async verifyToken(token: string) {
    return (await jwt.verify(token, jwtSettings.secretKey)) as IJwtPayload;
  }

  public async validateUser(payload: IJwtPayload) {
    return await this.userService.findOne(payload.id);
  }
}
