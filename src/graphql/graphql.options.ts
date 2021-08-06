import { stitchSchemas } from '@graphql-tools/stitch';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';

import config from 'config';
import { Request } from 'express';
import { GraphQLError, GraphQLSchema } from 'graphql';

import { corsOptionsDelegate } from '../cors.option';

import { User } from '../oauth/user/user.entity';
import { StitchingService } from './stitching/stitching.service';

import { GraphQLUpload } from './upload/upload.scalar';

const appSettings = config.get<IAppSettings>('APP_SETTINGS');
const graphqlSettings = config.get<IGraphqlSettings>('GRAPHQL_SETTINGS');

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  constructor(private readonly stitchingService: StitchingService) {}

  public createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      ...graphqlSettings,
      autoSchemaFile: __dirname + '/schema.graphql',
      formatError: (err: GraphQLError) => err,
      context: ({ req }: { req: Request & { user?: User } }) => ({
        req,
        user: req.user,
      }),
      cors: corsOptionsDelegate,
      bodyParserConfig: {
        limit: appSettings.bodyLimit,
      },
      uploads: false,
      transformSchema: async (schema: GraphQLSchema) => {
        const uploadSchema = makeExecutableSchema({
          typeDefs: `
            scalar Upload
          `,
          resolvers: {
            Upload: GraphQLUpload,
          },
        });

        const schemas: GraphQLSchema[] = [
          schema,
          uploadSchema,
          ...(await this.stitchingService.schemas()).filter(Boolean),
        ];

        const full_schema = stitchSchemas({
          subschemas: schemas,
        });

        return full_schema;
      },
    };
  }
}
