import { applyDecorators, SetMetadata } from '@nestjs/common';

export const RMQ_ROUTE_OPTIONS = 'RMQ_ROUTE_OPTIONS';

export interface IRabbitMQRouteOptions {
  exchange: string;
  routingKey: string;
  queue: string;
}

export const RabbitMQSubscribe = (options: IRabbitMQRouteOptions): MethodDecorator =>
  applyDecorators(
    SetMetadata(RMQ_ROUTE_OPTIONS, {
      ...options,
    })
  );
