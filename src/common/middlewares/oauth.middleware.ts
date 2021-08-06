import { Injectable, NestMiddleware } from '@nestjs/common';

import config from 'config';
import { NextFunction, Request, Response } from 'express';

import { access_denied, jwt_token_expired_signature } from '../errors';
import { getAction } from '../helpers/req.helper';

import { LoggerService } from '../../logger/logger.service';
import { OAuthService } from '../../oauth/oauth.service';
import { UserService } from '../../oauth/user/user.service';

import { IPayload } from '../../oauth/interface/payload.interface';
import { User } from '../../oauth/user/user.entity';

const actionBypass = config.get<string[]>('ACTION_BYPASS');

@Injectable()
export class OAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly oauthService: OAuthService,
    private readonly logger: LoggerService,
  ) {}

  public async use(
    req: Request & { user?: IPayload },
    _res: Response,
    next: NextFunction,
  ) {
    try {
      let authorizationCode =
        req.headers['X-Authorization'] || req.headers['x-authorization'];
      const jwtToken: string =
        req.headers.authorization || (req.cookies as { JWT: string }).JWT;

      let user: User;

      if (authorizationCode && !jwtToken) {
        if (typeof authorizationCode === 'object') {
          authorizationCode = authorizationCode[0];
        }

        user = await this.userService.findOneBy({ authorizationCode });
      } else if (jwtToken && !authorizationCode) {
        const decodedToken = this.oauthService.verifyToken(jwtToken);

        user = await this.userService.findOne(decodedToken.id);
      }

      if (user) {
        req.user = user.jwtPayload();

        return next();
      }

      if (await this.checkAuthBypass(req)) {
        return next();
      }

      return next(access_denied());
    } catch (error) {
      this.logger.error(error.message, error.stack, 'AuthMiddleware');
      return next(jwt_token_expired_signature());
    }
  }

  private async checkAuthBypass(req: Request): Promise<boolean> {
    const bypass = actionBypass.indexOf(getAction(req));

    if (bypass !== -1) {
      return true;
    }

    return false;
  }
}
