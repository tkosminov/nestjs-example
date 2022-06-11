import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import config from 'config';
import { verify } from 'jsonwebtoken';

import { account_blocked, jwt_token_expired_signature, unauthorized } from '../errors';
import { IJwtPayload } from './user/user.entity';

const jwt_settings = config.get<IJwtSettings>('JWT_SETTINGS');

@Injectable()
export class OAuthMiddleware implements NestMiddleware {
  public async use(req: Request & { user?: IJwtPayload }, _res: Response, next: NextFunction) {
    let user: IJwtPayload;

    const jwt_token: string = req.headers.authorization || (req.cookies as { JWT: string }).JWT;

    if (jwt_token) {
      try {
        user = verify(jwt_token, jwt_settings.secretKey) as IJwtPayload;

        if (user) {
          if (user.is_blocked) {
            return next(account_blocked({ raise: false }));
          }

          req.user = user;

          return next();
        }
      } catch (error) {
        return next(jwt_token_expired_signature({ raise: false }));
      }
    }

    return next(unauthorized({ raise: false }));
  }
}
