import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Request } from 'express';

import { IPayload } from '../../oauth/interface/payload.interface';

@Injectable()
export class GqlAdminGuard implements CanActivate {
  public canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    const { req }: { req: Request & { user?: IPayload } } = ctx.getContext();
    const user = req.user;

    if (user?.isAdmin) {
      return true;
    }

    return false;
  }
}
