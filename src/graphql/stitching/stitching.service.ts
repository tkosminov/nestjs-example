import { Injectable } from '@nestjs/common';

import { GraphQLSchema } from 'graphql';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import fetch from 'isomorphic-unfetch';

import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { RetryLink } from 'apollo-link-retry';
import TimeoutLink from 'apollo-link-timeout';

import config from 'config';

import { LoggerService } from '../../logger/logger.service';

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

      const timeoutLink = this.timeoutLink().concat(httpLink);
      const retryLink = this.retryLink().concat(timeoutLink);
      const link = this.contextLink().concat(retryLink);

      const coreIntrospect = await introspectSchema(link);

      return makeRemoteExecutableSchema({
        schema: coreIntrospect,
        link,
      });
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  private timeoutLink(): TimeoutLink {
    return new TimeoutLink(60000); // 60s
  }

  private retryLink(): RetryLink {
    return new RetryLink({
      attempts: {
        max: 0,
        retryIf: (error, _operation) => !!error,
      },
    });
  }

  private contextLink(): ApolloLink {
    return setContext((_req, previousContext) => {
      let currentUser = '{}';

      if (Object.keys(previousContext).length) {
        const user = previousContext.graphqlContext.req.user;
        if (user) {
          currentUser = JSON.stringify(user);
        }
      }

      return {
        headers: {
          currentUser,
        },
      };
    });
  }
}
