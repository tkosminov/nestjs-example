import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

import { LoggerStore } from '../logger/logger.store';

@Injectable()
export class RabbitMQService {
  constructor(
    private readonly config: ConfigService,
    private readonly amqp_connection: AmqpConnection
  ) {}

  public async send<T>(logger_store: LoggerStore, routing_key: string, message: T) {
    logger_store.info('RmqResultSendService: send', { routing_key });

    this.amqp_connection.channel.publish(
      `${this.config.get<string>('RABBITMQ_PREFIX')}${this.config.getOrThrow<string>('RABBITMQ_EXCHANGE')}`,
      routing_key,
      Buffer.from(JSON.stringify(message)),
      {
        timestamp: Date.now(),
        correlationId: v4(),
      }
    );
  }
}
