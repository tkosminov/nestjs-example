import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import config from 'config';

import { OAuthService } from './oauth.service';

import { IJwtPayload } from './interface/jwt-payload.iterface';

const secretJWTKey = config.get<IJwtSettings>('JWT_SETTINGS').secretKey;

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly oauthService: OAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretJWTKey,
    });
  }

  public async validate(payload: IJwtPayload) {
    const user = await this.oauthService.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
