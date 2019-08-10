import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';

import { GraphQLError, GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';

import { Request } from 'express';

import { LoggerService } from '../common/logger/logger.service';
import { StitchingService } from './stitching/stitching.service';

import corsOptions from '../cors.options';

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  constructor(private readonly stitchingService: StitchingService, private readonly logger: LoggerService) {}

  public createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      autoSchemaFile: __dirname + '/schema.graphql',
      typePaths: [__dirname + '../**/*.graphql'],
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      cors: corsOptions,
      context: ({ req }: { req: Request }) => ({ req }),
      uploads: {
        maxFiles: 5,
        maxFileSize: 1024 * 1024 * 10, // 10 MB
      },
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
