import { Injectable } from '@nestjs/common';

import { GraphQLSchema } from 'graphql';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import fetch from 'isomorphic-unfetch';

import { Operation } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { RetryLink } from 'apollo-link-retry';

import config from 'config';

const apiUrls = config.get<IApiUrls>('API_URLS');

@Injectable()
export class SchemasService {
  public async getSchemas(): Promise<GraphQLSchema[] | null[]> {
    return Promise.all([this.getApi1Schema(), this.getOtherSchema()]);
  }

  private async getApi1Schema(): Promise<GraphQLSchema | null> {
    try {
      const api1Link = new HttpLink({
        uri: apiUrls.API_1_SERVICE,
        fetch,
      });

      const retryLink = this.retryLink().concat(api1Link);
      const link = this.contextLink().concat(retryLink);

      const coreIntrospect = await introspectSchema(link);

      return makeRemoteExecutableSchema({
        schema: coreIntrospect,
        link,
      });
    } catch (error) {
      return null;
    }
  }

  private async getOtherSchema(): Promise<GraphQLSchema | null> {
    return null;
  }

  private retryLink() {
    return new RetryLink({
      attempts: {
        max: 1,
        retryIf: (error: Error, _operation: Operation) => !!error,
      },
    });
  }

  private contextLink() {
    return setContext((_req, previousContext) => {
      let currentUser = '{}';

      // tslint:disable: no-unsafe-any
      if (Object.keys(previousContext).length) {
        currentUser = JSON.stringify(previousContext.graphqlContext.req.user);
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
