import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RestCurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.current_user;
});
