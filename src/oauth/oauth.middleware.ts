import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { JwtService } from '../jwt/jwt.service';
import { access_token_expired_signature, authorization_failed, unauthorized } from '../utils/errors';
import { IAccessToken } from './oauth.service';
import { IJwtPayload } from './user/user.entity';

@Injectable()
export class OAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}

  public async use(req: Request & { current_user?: IJwtPayload }, _res: Response, next: NextFunction) {
    const access_token: string = req.headers.authorization ?? (req.cookies as { access_token: string }).access_token;

    if (access_token) {
      try {
        const { current_user, token_type } = this.jwt.verify<IAccessToken>(access_token);

        if (token_type !== 'access') {
          return next(authorization_failed());
        }

        req.current_user = current_user;

        return next();
      } catch (error) {
        return next(access_token_expired_signature());
      }
    }

    return next(unauthorized());
  }
}
