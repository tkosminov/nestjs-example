import EventEmitter from 'events';

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { connect, AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Channel, Message, Connection, ConfirmChannel } from 'amqplib';
import { v4 } from 'uuid';

import { LoggerService } from '../logger/logger.service';

import {
  IRMQModuleOptions,
  IRMQConnection,
  RMQ_MODULE_OPTIONS,
  RMQ_REPLY_QUEUE,
  ERROR_EVENT,
  DISCONNECT_EVENT,
  CONNECT_EVENT,
  IRMQHandler,
  TRMQResponse,
} from './rmq.constants';
import { RmqExplorer } from './rmq.explorer';

@Injectable()
export class RmqService implements OnModuleInit {
  protected server: AmqpConnectionManager;
  protected connection: Connection;
  protected client_channel: ChannelWrapper;
  protected subscription_channel: ChannelWrapper;
  protected send_response_emmiter: EventEmitter = new EventEmitter();

  constructor(
    @Inject(RMQ_MODULE_OPTIONS) private readonly options: IRMQModuleOptions,
    private readonly rmqExplorerService: RmqExplorer,
    private readonly logger: LoggerService
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async onModuleInit() {
    const connection_uri = this.createConnectionUri(this.options.connection);

    const connection_options = {
      reconnectTimeInSeconds: this.options.reconnectTimeInSeconds ?? 5,
      heartbeatIntervalInSeconds: this.options.heartbeatIntervalInSeconds ?? 5,
    };

    this.server = connect([connection_uri], connection_options);

    this.server.on(CONNECT_EVENT, (connection: Connection) => {
      this.connection = connection;

      this.logger.info('RMQModule connected');
    });

    this.server.addListener(ERROR_EVENT, (err: unknown) => {
      this.logger.error(err);
    });

    this.server.addListener(DISCONNECT_EVENT, (err: any) => {
      this.logger.error(err);

      this.close();
    });

    await Promise.all([this.createSubscriptionChannel(), this.createClientChannel()]);

    const handlers = this.rmqExplorerService.handlers;

    for (const handler of handlers) {
      await this.createQueue(handler);
    }

    this.logger.info('RMQModule dependencies initialized');
  }

  private createConnectionUri(connection: IRMQConnection): string {
    let uri = `amqp://${connection.login}:${connection.password}@${connection.host}`;

    if (connection.port) {
      uri += `:${connection.port}`;
    }

    if (connection.vhost) {
      uri += `/${connection.vhost}`;
    }

    return uri;
  }

  private async createSubscriptionChannel() {
    this.subscription_channel = this.server.createChannel({
      json: false,
      setup: async (channel: Channel) => {
        await channel.assertExchange(this.options.exchange.name, this.options.exchange.type, {
          durable: this.options.exchange.durable,
          arguments: this.options.exchange.arguments,
        });

        await channel.prefetch(this.options.prefetchCount ?? 0, this.options.isGlobalPrefetchCount ?? false);
      },
    });
  }

  private async createClientChannel() {
    this.client_channel = this.server.createChannel({
      json: false,
      setup: async (channel: Channel) => {
        await channel.consume(
          RMQ_REPLY_QUEUE,
          (msg: Message) => {
            this.send_response_emmiter.emit(msg.properties.correlationId, msg);
          },
          {
            noAck: true,
          }
        );
      },
    });
  }

  private close(): void {
    if (this.subscription_channel) {
      this.subscription_channel.close();
    }

    if (this.client_channel) {
      this.client_channel.close();
    }

    if (this.server) {
      this.server.close();
    }

    this.send_response_emmiter.removeAllListeners();

    this.server = null;
    this.subscription_channel = null;
    this.client_channel = null;
    this.connection = null;
  }

  public async send<T>(routing_key: string, message: T) {
    await this.client_channel.publish(this.options.exchange.name, routing_key, Buffer.from(JSON.stringify(message)), {
      replyTo: RMQ_REPLY_QUEUE,
      timestamp: new Date().getTime(),
      correlationId: v4(),
    });
  }

  public async createQueue(handler: IRMQHandler) {
    await this.subscription_channel.addSetup(async (channel: ConfirmChannel) => {
      const { queue } = await channel.assertQueue(handler.meta.queue);

      await channel.bindQueue(queue, handler.meta.exchange, handler.meta.routingKey);

      this.logger.info(`bindQueue - ${handler.meta.routingKey}`);

      await channel.consume(queue, async (msg) => {
        this.logger.info(`consume - ${handler.meta.routingKey}`);

        const msg_content = msg.content.toString();

        const response: TRMQResponse = await handler.discoveredMethod.parentClass[handler.discoveredMethod.methodName](
          JSON.parse(msg_content)
        );

        if (response === 'nack') {
          channel.nack(msg, false, false);
        } else {
          channel.ack(msg, false);
        }
      });
    });
  }
}
