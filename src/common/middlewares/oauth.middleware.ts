import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import config from 'config';
import jwt from 'jsonwebtoken';

import { UserService } from '../../oauth/user/user.service';

import { jwt_token_expired_signature, unauthorized } from '../errors';
import { ReqHelper } from '../helpers/req.helper';

import { IPayload } from '../../oauth/interface/payload.interface';

const secretJWTKey = config.get<IJwtSettings>('JWT_SETTINGS').secretKey;
const actionBypass = config.get<string[]>('ACTION_BYPASS');

@Injectable()
export class OAuthMiddleware extends ReqHelper implements NestMiddleware {
  constructor(private readonly userService: UserService) {
    super();
  }

  public async use(req: Request, _res: Response, next: NextFunction) {
    if (await this.checkJWTToken(req)) {
      return next();
    }

    if (await this.checkAuthBypass(req)) {
      return next();
    }

    unauthorized({ raise: true });
  }

  private async checkJWTToken(req: Request): Promise<boolean> {
    const token: string = req.headers.authorization || req.cookies.JWT;

    if (token) {
      let payload: IPayload;

      // tslint:disable-next-line: try-catch-first
      try {
        payload = jwt.verify(token, secretJWTKey) as IPayload;
      } catch (e) {
        jwt_token_expired_signature({ raise: true });
      }

      const user = await this.userService.findOne(payload.id);

      if (user) {
        req.user = user;

        return true;
      }
    }

    return false;
  }

  private async checkAuthBypass(req: Request): Promise<boolean> {
    const currentAction = this.getUrl(req).split('/')[1];
    const bypass = actionBypass.indexOf(currentAction);

    if (bypass !== -1) {
      return true;
    }

    return false;
  }
}
