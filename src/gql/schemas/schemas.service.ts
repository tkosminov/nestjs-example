import { Injectable } from '@nestjs/common';

import config from 'config';
import fetch from 'isomorphic-unfetch';

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

      const coreIntrospect = await introspectSchema(coreLink);

      return makeRemoteExecutableSchema({
        schema: coreIntrospect,
        link: coreLink,
      });
    } catch (e) {
      return null;
    }
  }

  private async getOtherSchema(): Promise<GraphQLSchema | null> {
    return null;
  }
}
