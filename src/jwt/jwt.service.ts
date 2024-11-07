import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Algorithm, sign, verify } from 'jsonwebtoken';
import { v4 } from 'uuid';

import { access_token_expired_signature, refresh_token_expired_signature } from '../utils/errors';

@Injectable()
export class JwtService {
  constructor(private readonly config: ConfigService) {}

  public generate<T extends object>(payload: T, jwtid?: string) {
    return sign(payload, this.config.getOrThrow<string>('JWT_SECRET_KEY'), {
      jwtid: jwtid ?? v4(),
      expiresIn: `${this.config.getOrThrow<string>('JWT_ACCESS_TOKEN_LIFETIME_IN_MINUTES')}m`,
      algorithm: this.config.getOrThrow<Algorithm>('JWT_ALGORITHM'),
    });
  }

  public verify<T>(jwt_token: string, is_access_token = true) {
    try {
      return verify(jwt_token, this.config.getOrThrow<string>('JWT_SECRET_KEY')) as T;
    } catch (error) {
      if (is_access_token) {
        throw access_token_expired_signature();
      } else {
        throw refresh_token_expired_signature();
      }
    }
  }
}
