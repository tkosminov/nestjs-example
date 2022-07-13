import { getApolloServer } from '@nestjs/apollo';
import { INestApplication, Injectable } from '@nestjs/common';

import { ApolloServerBase } from 'apollo-server-core';
import set from 'lodash.set';
import { v4 } from 'uuid';

import { LoggerService } from '../../logger/logger.service';
import { RedisService } from '../../redis/redis.service';
import { GraphqlOptions } from '../graphql.options';

@Injectable()
export class GraphQLSchemaReloadService {
  private app: INestApplication = null;
  private apollo_server: ApolloServerBase = null;
  private graphql_options: GraphqlOptions = null;

  private ready = false;
  private readonly redis_channel: string = 'auth_reload_graphql_schema_channel';
  private readonly service_id: string = v4();

  private check_apollo_interval: NodeJS.Timer = null;

  constructor(private readonly logger: LoggerService, private readonly redisService: RedisService) {
    this.check_apollo_interval = setInterval(() => {
      this.checkApolloServer();
    }, 2000);

    this.redisService.fromEvent(this.redis_channel).subscribe(async (data: { service_id: string }) => {
      this.logger.info('GraphQLSchemaReloadService: redisEvent', { current_service_id: this.service_id, from_service_id: data.service_id });

      if (this.service_id !== data.service_id) {
        await this.reloadGraphQLSchema();
      }
    });
  }

  public applyApp(app: INestApplication) {
    this.app = app;
  }

  private async checkApolloServer() {
    if (this.app) {
      this.logger.info('GraphQLSchemaReloadService: checkApolloServer');

      this.apollo_server = getApolloServer(this.app);

      if (this.apollo_server) {
        this.graphql_options = this.app.get(GraphqlOptions);

        clearInterval(this.check_apollo_interval);
        this.check_apollo_interval = null;

        this.ready = true;

        this.logger.info('GraphQLSchemaReloadService: checkApolloServer: dependencies initialized');
      }
    }
  }

  public async reloadGraphQLSchema(send_alert = false) {
    this.logger.info('GraphQLSchemaReloadService: reloadGraphQLSchema', { ready: this.ready });

    if (this.ready) {
      const new_schema = await this.graphql_options.mergeSchemas();
      const schema_derived_data = await (this.apollo_server as any).generateSchemaDerivedData(new_schema);

      set(this.apollo_server, 'schema', new_schema);
      set(this.apollo_server, 'state.schemaManager.schemaDerivedData', schema_derived_data);

      if (send_alert) {
        await this.redisService.publish(this.redis_channel, { service_id: this.service_id });
      }

      return { schema: new_schema };
    }

    return { schema: null };
  }
}
