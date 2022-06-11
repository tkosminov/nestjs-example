import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import config from 'config';
import { Request } from 'express';

const GRAPHQL_GUARD = config.get<IGuard>('GRAPHQL_GUARD');

@Injectable()
export class GraphQLSchemaReloadGuard implements CanActivate {
  public canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();

    const header = req.headers.authorization;

    if (header) {
      const data = header.split(' ');

      if (data[0] === 'Basic') {
        const auth = Buffer.from(data[1], 'base64').toString();

        const credentials = auth.split(':');

        if (credentials[0] === GRAPHQL_GUARD.username && credentials[1] === GRAPHQL_GUARD.password) {
          return true;
        }
      }
    }

    return false;
  }
}
