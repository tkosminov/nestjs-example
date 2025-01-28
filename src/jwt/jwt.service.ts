import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Algorithm, sign, verify } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { v4 } from 'uuid';

import { access_token_expired_signature, refresh_token_expired_signature } from '../utils/errors';

@Injectable()
export class JwtService {
  constructor(private readonly config: ConfigService) {}

  public generateAccess<T extends object>(payload: T) {
    return sign({ ...payload, token_type: 'access' }, this.config.getOrThrow<string>('JWT_SECRET_KEY'), {
      jwtid: v4(),
      expiresIn: `${this.config.getOrThrow<string>('JWT_ACCESS_TOKEN_LIFETIME_IN_MINUTES')} Minutes` as StringValue,
      algorithm: this.config.getOrThrow<Algorithm>('JWT_ALGORITHM'),
    });
  }

  public generateRefresh<T extends object>(payload: T, jwtid: string) {
    return sign({ ...payload, token_type: 'refresh' }, this.config.getOrThrow<string>('JWT_SECRET_KEY'), {
      jwtid,
      expiresIn: `${this.config.getOrThrow<string>('JWT_REFRESH_TOKEN_LIFETIME_IN_MINUTES')} Minutes` as StringValue,
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
