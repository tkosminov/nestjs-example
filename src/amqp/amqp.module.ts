import { Module } from '@nestjs/common';

import { LoggerService } from '../logger/logger.service';

import { AmqpService } from './amqp.service';

@Module({
  imports: [],
  providers: [
    AmqpService,
    {
      provide: LoggerService,
      useValue: new LoggerService('AmqpModule'),
    },
  ],
  exports: [AmqpService],
})
export class AmqpModule {}
