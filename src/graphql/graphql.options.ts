import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { stitchSchemas } from '@graphql-tools/stitch';

import { GraphQLError, GraphQLSchema } from 'graphql';
import config from 'config';
import { Request } from 'express';
import { DataSource } from 'typeorm';

import { LoggerStore } from '../logger/logger.store';
import { cors_options_delegate } from '../cors.options';
import { GraphQLStitchingService } from './stitching/stitching.service';

const app_settings = config.get<IAppSettings>('APP_SETTINGS');
const graphql_settings = config.get<IGraphqlSettings>('GRAPHQL_SETTINGS');

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  public base_schema: GraphQLSchema = null;

  constructor(private readonly dataSource: DataSource, private readonly stitchingService: GraphQLStitchingService) {}

  public async mergeSchemas() {
    const schemas: GraphQLSchema[] = [this.base_schema, ...(await this.stitchingService.schemas()).filter(Boolean)];

    return stitchSchemas({
      subschemas: schemas,
    });
  }

  public createGqlOptions(): Promise<ApolloDriverConfig> | ApolloDriverConfig {
    return {
      ...graphql_settings,
      driver: ApolloDriver,
      autoSchemaFile: __dirname + '/schema.graphql',
      formatError: (err: GraphQLError) => {
        return err;
      },
      context: ({ req }: { req: Request & { logger_store: LoggerStore } }) => ({
        req,
        logger_store: req.logger_store,
        data_source: this.dataSource,
      }),
      cors: cors_options_delegate,
      bodyParserConfig: {
        limit: app_settings.body_limit,
      },
      transformSchema: async (schema: GraphQLSchema) => {
        this.base_schema = schema;

        return await this.mergeSchemas();
      },
    };
  }
}
