import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class UserGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    GqlExecutionContext.create(context);
    return true;
  }
}
