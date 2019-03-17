import { HttpException, Injectable, MiddlewareFunction, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import config from 'config';
import jwt from 'jsonwebtoken';

import { UserService } from '../../user/user.service';

import { ReqHelper } from '../helpers/req.helper';

import { IJwtPayload } from '../../auth/interfaces/jwt-payload.iterface';

const secretJWTKey = config.get<IJwtSettings>('JWT_SETTINGS').secretKey;

@Injectable()
export class AuthMiddleware extends ReqHelper implements NestMiddleware {
  constructor(private readonly userService: UserService) {
    super();
  }

  // tslint:disable-next-line: no-feature-envy
  public resolve(): MiddlewareFunction {
    return async (req: Request, _res: Response, next: NextFunction) => {
      if (this.getUrl(req).split('/')[1] === 'auth') {
        return next();
      }

      if (req.headers.authorization) {
        let payload: IJwtPayload;

        // tslint:disable-next-line: try-catch-first
        try {
          payload = (await jwt.verify(req.headers.authorization, secretJWTKey)) as IJwtPayload;
        } catch (e) {
          throw new HttpException('Invalid JWT token', 400);
        }

        const user = await this.userService.findOne(payload.id);

        if (user) {
          req.user = user;

          return next();
        }
      }

      throw new UnauthorizedException();
    };
  }
}
