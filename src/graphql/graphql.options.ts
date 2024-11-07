import { type Plugin, type SetSchemaFn, useLogger } from '@envelop/core';
import { useResponseCache } from '@envelop/response-cache';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { Request } from 'express';
import { DocumentNode, GraphQLArgs, GraphQLSchema } from 'graphql';
import { ConnectionInitMessage, Context } from 'graphql-ws';
import { IncomingMessage } from 'http';
import { setDataSource } from 'nestjs-graphql-easy';
import { DataSource } from 'typeorm';

import { JwtService } from '../jwt/jwt.service';
import { LoggerService } from '../logger/logger.service';
import { LoggerStore } from '../logger/logger.store';
import { IAccessToken } from '../oauth/oauth.service';
import { IJwtPayload } from '../oauth/user/user.entity';
import { getCookie } from '../utils/request';
import { GraphQLStitchingService } from './stitching/stitching.service';

const setSchemaUpdater: (setFn: (schemaUpdater: SetSchemaFn) => GraphQLSchema) => Plugin = (fn) => ({
  onPluginInit({ setSchema: set_schema }) {
    fn(set_schema);
  },
});

@Injectable()
export class GraphQLOptions implements GqlOptionsFactory {
  public schemaUpdater: SetSchemaFn | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly data_source: DataSource,
    private readonly logger: LoggerService,
    private readonly jwt: JwtService,
    private readonly stitching_service: GraphQLStitchingService
  ) {
    setDataSource(this.data_source);

    this.stitching_service.schema$.subscribe((schema: GraphQLSchema) => {
      if (this.schemaUpdater != null) {
        this.schemaUpdater(schema);
      }
    });
  }

  public setSchemaUpdater(updater: SetSchemaFn) {
    this.schemaUpdater = updater;
  }

  public createGqlOptions(): Promise<YogaDriverConfig> | YogaDriverConfig {
    return {
      autoSchemaFile: true,
      driver: YogaDriver,
      subscriptions: {
        'graphql-ws': {
          onConnect: (
            ctx: Context<
              ConnectionInitMessage['payload'],
              { request: IncomingMessage & { logger_store: LoggerStore; current_user: IJwtPayload } }
            >
          ) => {
            const access_token =
              (ctx.connectionParams as { authorization?: string } | undefined)?.authorization ??
              getCookie(ctx.extra.request.headers.cookie ?? '', 'access_token');

            if (access_token?.length) {
              try {
                const { current_user, token_type } = this.jwt.verify<IAccessToken>(access_token);

                if (token_type !== 'access') {
                  return false;
                }

                ctx.extra.request.current_user = current_user;
                ctx.extra.request.logger_store = new LoggerStore(this.logger);

                ctx.extra.request.logger_store.info('GraphQLOptions: onConnect', { user_id: ctx.extra.request.current_user.id });

                return true;
              } catch (e) {
                return false;
              }
            }

            return false;
          },
          onDisconnect: async (
            ctx: Context<
              ConnectionInitMessage['payload'],
              { request: IncomingMessage & { logger_store: LoggerStore; current_user: IJwtPayload } }
            >
          ) => {
            ctx.extra.request.logger_store.info('GraphQLOptions: onDisconnect', { user_id: ctx.extra.request.current_user.id });
          },
        },
        'subscriptions-transport-ws': false,
      },
      context: ({ req }: { req: Request & { logger_store: LoggerStore; current_user: IJwtPayload } }) => ({
        req,
        logger_store: req.logger_store,
        current_user: req.current_user,
      }),
      transformSchema: async (schema: GraphQLSchema) => {
        this.stitching_service.setCurrentSchema(schema);

        await this.stitching_service.reloadSchemas();

        if (this.stitching_service.schema$.value) {
          return this.stitching_service.schema$.value;
        }

        return schema;
      },
      plugins: [
        setSchemaUpdater(this.setSchemaUpdater.bind(this)),
        useResponseCache({
          session: ({ current_user }: { current_user: IJwtPayload }) => String(current_user.id),
          ttl: parseInt(this.config.getOrThrow<string>('GRAPHQL_CACHE_TTL'), 10),
          invalidateViaMutation: true,
        }),
        useLogger({
          logFn: (
            event_name: string,
            {
              args,
            }: {
              args: GraphQLArgs & {
                document: DocumentNode;
                contextValue: {
                  req: Request;
                  logger_store: LoggerStore;
                  params: {
                    query: string;
                  };
                };
              };
              result?: unknown;
            }
          ) => {
            const ctx = args.contextValue;
            const logger_store: LoggerStore = ctx.logger_store;

            let operation = '';
            const selections: string[] = [];

            args.document.definitions.forEach((definition) => {
              if (definition.kind === 'OperationDefinition') {
                operation = definition.operation;

                definition.selectionSet.selections.forEach((selection) => {
                  if (selection.kind === 'Field') {
                    selections.push(selection.name.value);
                  }
                });
              }
            });

            logger_store.info(`GraphQL ${event_name}`, { event: event_name, operation, selections });
          },
        }),
      ],
    };
  }
}
