import { Injectable } from '@nestjs/common';

import config from 'config';
import fetch from 'isomorphic-unfetch';

import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { GraphQLSchema } from 'graphql';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';

const apiUrls: IApiUrls = config.get('API_URLS');

@Injectable()
export class SchemasService {
  public async getSchemas(): Promise<GraphQLSchema[] | null[]> {
    return Promise.all([this.getCoreSchema(), this.getOtherSchema()]);
  }

  private async getCoreSchema(): Promise<GraphQLSchema | null> {
    try {
      const coreLink = new HttpLink({
        uri: apiUrls.CORE_SERVICE,
        fetch,
      });

      const link = setContext((_req, previousContext) => {
        let currentUser = '{}';

        // tslint:disable: no-unsafe-any
        if (Object.keys(previousContext).length) {
          // see 'src/common/middlewares/auth.middleware.ts'
          currentUser = JSON.stringify(previousContext.graphqlContext.req.user);
        }

        return {
          headers: {
            currentUser,
          },
        };
      }).concat(coreLink);
      // tslint:enable: no-unsafe-any

      const coreIntrospect = await introspectSchema(link);

      return makeRemoteExecutableSchema({
        schema: coreIntrospect,
        link,
      });
    } catch (e) {
      return null;
    }
  }

  private async getOtherSchema(): Promise<GraphQLSchema | null> {
    return null;
  }
}
