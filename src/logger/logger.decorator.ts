import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Logger = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  return req.logger_store;
});
