import { Injectable } from '@nestjs/common';

import { GraphQLSchema } from 'graphql';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import fetch from 'isomorphic-unfetch';

import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { RetryLink } from 'apollo-link-retry';

import { LoggerService } from '../../common/logger/logger.service';

import config from 'config';

const apiUrls: string[] = config.get('GRAPHQL_API_URLS');

@Injectable()
export class StitchingService {
  constructor(private readonly logger: LoggerService) {}

  public async schemas(): Promise<GraphQLSchema[] | null[]> {
    return Promise.all(apiUrls.map(url => this.getApiSchema(url)));
  }

  private async getApiSchema(apiLink: string): Promise<GraphQLSchema | null> {
    try {
      const httpLink = new HttpLink({
        uri: apiLink,
        fetch,
      });

      const retryLink = this.retryLink().concat(httpLink);
      const link = this.contextLink().concat(retryLink);

      const coreIntrospect = await introspectSchema(link);

      return makeRemoteExecutableSchema({
        schema: coreIntrospect,
        link,
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      return null;
    }
  }

  private retryLink() {
    return new RetryLink({
      attempts: {
        max: 1,
        retryIf: (error, _operation) => !!error,
      },
    });
  }

  private contextLink() {
    return setContext((_req, previousContext) => {
      let currentUser = '{}';

      // tslint:disable: no-unsafe-any
      if (Object.keys(previousContext).length) {
        const user = previousContext.graphqlContext.req.user;
        if (user) {
          currentUser = JSON.stringify(user);
        }
      }
      // tslint:enable: no-unsafe-any

      return {
        headers: {
          currentUser,
        },
      };
    });
  }
}
