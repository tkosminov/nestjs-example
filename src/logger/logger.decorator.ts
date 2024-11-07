import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RestLogger = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.logger_store;
});
