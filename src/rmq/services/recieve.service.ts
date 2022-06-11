import { Injectable } from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';

import { TRMQResponse } from '../rmq.constants';
import { RMQProvider, RMQSubscription } from '../rmq.decorators';
import { RmqService } from '../rmq.service';

@RMQProvider()
@Injectable()
export class RmqRecieveService {
  constructor(private readonly logger: LoggerService, public readonly rmqService: RmqService) {}

  @RMQSubscription({
    exchange: `example`,
    routingKey: 'example_routing_key',
    queue: `example_queue`,
  })
  protected async example(msg: unknown): Promise<TRMQResponse> {
    try {
      console.log(msg);

      return 'ack';
    } catch (error) {
      this.logger.error(`RmqRecieveService: example - ${JSON.stringify(error)}`);

      return 'nack';
    }
  }
}
