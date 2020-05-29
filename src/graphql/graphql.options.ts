import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLError, GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';

import config from 'config';
import { Request } from 'express';

import { corsOptionsDelegate } from '../cors.option';
import { LoggerService } from '../logger/logger.service';

import { StitchingService } from './stitching/stitching.service';

const appSettings = config.get<IAppSettings>('APP_SETTINGS');
const graphqlSettings = config.get<IGraphqlSettings>('GRAPHQL_SETTINGS');

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  constructor(private readonly logger: LoggerService, private readonly stitchingService: StitchingService) {}

  public createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      ...graphqlSettings,
      autoSchemaFile: __dirname + '/schema.graphql',
      typePaths: [__dirname + '../**/*.graphql'],
      cors: corsOptionsDelegate,
      bodyParserConfig: {
        limit: appSettings.bodyLimit,
      },
      context: ({ req }: { req: Request }) => ({
        req,
        user: req.user,
      }),
      formatError: (error: GraphQLError) => {
        this.logger.error(error);
        return error;
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
