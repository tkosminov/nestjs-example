import { Injectable } from '@nestjs/common';

import { Channel } from 'amqplib';
import config from 'config';

import { LoggerService } from '../logger/logger.service';

import { amqpConnect } from './amqp.connect';
import { IAmqpOptions, TAmqpResponse } from './amqp.interface';

import subscriptions from './handlers';

const amqpSettings: IAmqpSettings = config.get('AMQP_SETTINGS');

@Injectable()
export class AmqpService {
  public amqpChannel: Channel;

  constructor(private readonly logger: LoggerService) {
    this.createChannel();
  }

  private createChannel() {
    amqpConnect().then(channel => {
      this.logger.warn('Channel created');
      this.amqpChannel = channel;

      this.amqpChannel.on('error', err => {
        this.logger.error(err);

        setTimeout(() => {
          this.createChannel();
        }, amqpSettings.reconnectDelay);
      });

      this.amqpChannel.on('close', _err => {
        this.logger.warn('Channel closed');

        setTimeout(() => {
          this.createChannel();
        }, amqpSettings.reconnectDelay);
      });

      this.amqpChannel
        .assertExchange(amqpSettings.exchange, amqpSettings.exchangeType, {
          durable: true,
        })
        .then(res => {
          this.logger.warn(`AssertExchange ${res.exchange}`);

          subscriptions.forEach(async sub => {
            await this.subscribeMessage(sub.options, sub.handler);
          });
        });

      this.amqpChannel.prefetch(amqpSettings.prefetch);
    });
  }

  private async subscribeMessage(
    options: IAmqpOptions,
    // tslint:disable-next-line: no-any
    handler: (msg: any, logger?: LoggerService) => Promise<TAmqpResponse>
  ) {
    try {
      const { queue } = await this.amqpChannel.assertQueue(options.queue || '');

      await this.amqpChannel.bindQueue(queue, options.exchange, options.routingKey);

      this.logger.warn(`bindQueue - ${options.queue}`);

      await this.amqpChannel.consume(queue, async msg => {
        if (msg !== null) {
          const msgContent = msg.content.toString();

          this.logger.warn(msgContent, `Consume - ${options.routingKey}`);

          const message = JSON.parse(msgContent);

          const response = await handler(message, this.logger);

          if (response === 'nack') {
            this.amqpChannel.nack(msg, false, false);
          } else {
            this.amqpChannel.ack(msg, false);
          }
        }
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  public async sendMessage<T>(msg: T, routingKey: string) {
    try {
      if (this.amqpChannel) {
        this.amqpChannel.publish(amqpSettings.exchange, routingKey, Buffer.from(JSON.stringify(msg)));
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }
}
