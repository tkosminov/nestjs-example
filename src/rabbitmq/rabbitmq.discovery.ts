import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IRabbitMQRouteOptions, RMQ_ROUTE_OPTIONS } from './rabbitmq.decorator';

@Injectable()
export class RabbitMQDiscovery implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    private readonly discover: DiscoveryService
  ) {}

  public async onModuleInit() {
    const RABBITMQ_PREFIX = this.config.get<string>('RABBITMQ_PREFIX');

    const rabbit_handlers = await this.discover.providerMethodsWithMetaAtKey<IRabbitMQRouteOptions>(RMQ_ROUTE_OPTIONS);

    rabbit_handlers.forEach((handler) => {
      const options: IRabbitMQRouteOptions = {
        exchange: `${RABBITMQ_PREFIX}${handler.meta.exchange}`,
        routingKey: handler.meta.routingKey,
        queue: `${RABBITMQ_PREFIX}${handler.meta.queue}`,
      };

      RabbitSubscribe(options)(handler.discoveredMethod.handler);
    });
  }
}
