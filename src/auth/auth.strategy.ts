import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import config from 'config';

import { AuthService } from './auth.service';

import { IJwtPayload } from './interfaces/jwt-payload.iterface';

const secretJWTKey = config.get<IJwtSettings>('JWT_SETTINGS').secretKey;

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretJWTKey,
    });
  }

  public async validate(payload: IJwtPayload) {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
