import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

import { Response } from 'express';

@Catch(HttpException)
export class AnyExceptionFilter implements ExceptionFilter, GqlExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const statusCode = exception.getStatus();

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (Object.keys(response).length) {
      response.status(statusCode).json({
        statusCode,
        timestamp: new Date().toISOString(),
        message: exception.getResponse(),
      });
    } else {
      const gqlHost = GqlArgumentsHost.create(host);
      const gqlCtx = gqlHost.getContext();
      const gqlResponse = gqlCtx.res;

      gqlResponse.status(statusCode);

      return exception;
    }
  }
}
