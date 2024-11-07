import { INestApplication, Injectable } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { v4 } from 'uuid';

import { LoggerService } from '../../logger/logger.service';
import { RedisService } from '../../redis/redis.service';
import { GraphQLStitchingService } from '../stitching/stitching.service';

const CHECK_SERVER_READY_INTERVAL = 2000;

@Injectable()
export class GraphQLReloaderService {
  private app: INestApplication | null = null;

  private ready = false;
  private readonly redis_key: string = 'reload_graphql_schema';
  private readonly service_id: string = v4();

  private check_yoga_interval: NodeJS.Timeout | null = null;

  constructor(
    private readonly redis_service: RedisService,
    private readonly stitching_service: GraphQLStitchingService,
    private readonly logger: LoggerService
  ) {
    this.check_yoga_interval = setInterval(() => {
      this.checkYogaServer();
    }, CHECK_SERVER_READY_INTERVAL);

    this.redis_service.fromEvent(this.redis_key).subscribe(async (data: { service_id: string }) => {
      this.logger.info('GraphQLReloaderService: fromEvent', {
        current_service_id: this.service_id,
        from_service_id: data.service_id,
      });

      if (this.service_id !== data.service_id) {
        await this.reloadGraphQLSchema();
      }
    });
  }

  public applyApp(app: INestApplication) {
    this.app = app;
  }

  private async checkYogaServer() {
    this.logger.info('GraphQLReloaderService: checkYogaServer', { ready: this.ready, service_id: this.service_id });

    if (this.app) {
      if (this.app.get(GraphQLModule).graphQlAdapter) {
        if (this.check_yoga_interval) {
          clearInterval(this.check_yoga_interval);
          this.check_yoga_interval = null;
        }

        this.ready = true;

        this.logger.info('GraphQLReloaderService: checkYogaServer', { ready: this.ready, service_id: this.service_id });
      }
    }
  }

  public async reloadGraphQLSchema(send_alert = false) {
    this.logger.info('GraphQLReloaderService: reloadGraphQLSchema', { ready: this.ready, service_id: this.service_id });

    if (this.ready) {
      await this.stitching_service.reloadSchemas();

      if (send_alert) {
        await this.redis_service.publish(this.redis_key, { service_id: this.service_id });
      }
    }
  }
}
