import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';

import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';

import { Request } from 'express';

import { StitchingService } from './stitching/stitching.service';

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  constructor(private readonly stitchingService: StitchingService) {}

  public createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      autoSchemaFile: __dirname + '/schema.graphql',
      typePaths: [__dirname + '../**/*.graphql'],
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      context: ({ req }: { req: Request }) => ({ req }),
      definitions: {
        path: __dirname + '/schema.ts',
        outputAs: 'interface',
      },

      transformSchema: async (schema: GraphQLSchema) => {
        const schemas: GraphQLSchema[] = [schema, ...(await this.stitchingService.schemas())];

        return mergeSchemas({
          schemas: schemas.filter(Boolean),
        });
      },
    };
  }
}
