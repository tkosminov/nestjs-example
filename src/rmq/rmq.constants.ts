export const RMQ_MODULE_OPTIONS = 'RMQ_MODULE_OPTIONS';
export const RMQ_PROVIDER_OPTIONS = 'RMQ_PROVIDER_OPTIONS';
export const RMQ_ROUTES_OPTIONS = 'RMQ_ROUTES_OPTIONS';
export const RMQ_REPLY_QUEUE = 'amq.rabbitmq.reply-to';

export const CONNECT_EVENT = 'connect';
export const DISCONNECT_EVENT = 'disconnect';
export const MESSAGE_EVENT = 'message';
export const DATA_EVENT = 'data';
export const ERROR_EVENT = 'error';
export const CLOSE_EVENT = 'close';
export const SUBSCRIBE = 'subscribe';
export const CANCEL_EVENT = 'cancelled';

export interface IRMQConnection {
  login: string;
  password: string;
  host: string;
  port: string;
  vhost: string;
}

export interface IRMQExchange {
  name: string;
  durable: boolean;
  type: 'topic' | 'direct' | 'x-delayed-message';
  arguments?: {
    [key: string]: unknown;
  };
}

export interface IRMQModuleOptions {
  exchange: IRMQExchange;
  connection: IRMQConnection;
  reconnectTimeInSeconds?: number;
  heartbeatIntervalInSeconds?: number;
  prefetchCount?: number;
  isGlobalPrefetchCount?: boolean;
}

export interface IRouteOptions {
  exchange: string;
  routingKey: string;
  queue: string;
}

export type TRMQResponse = 'ack' | 'nack';

export interface IRMQHandler {
  meta: IRouteOptions;
  discoveredMethod: {
    handler: any;
    methodName: string;
    parentClass: any;
  };
}
