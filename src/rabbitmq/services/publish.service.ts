import { Inject, Injectable } from '@nestjs/common';
import { Channel } from 'amqplib';

import config from 'config';

import { LoggerService } from '../../common/logger/logger.service';

const rabbitSettings: IRabbitMQSettings = config.get('RABBITMQ_SETTINGS');

@Injectable()
export class RabbitPublishService {
  constructor(private readonly logger: LoggerService, @Inject('AQMP_CHANNEL') private readonly aqmpChannel: Channel) {}

  public publish_example(msg: string) {
    try {
      this.aqmpChannel.publish(rabbitSettings.exchange, 'publish_example', Buffer.from(JSON.stringify({ msg })));
    } catch (error) {
      this.logger.error(`RabbitPublishService: publish_example: Msg - ${JSON.stringify(error)}`);
    }
    return;
  }
}
