import { Module } from '@nestjs/common';

import { LoggerService } from '../logger/logger.service';

import { WssGateway } from './wss.gateway';

@Module({
  imports: [],
  providers: [
    WssGateway,
    {
      provide: LoggerService,
      useValue: new LoggerService('WssModule'),
    },
  ],
  exports: [WssGateway],
  controllers: [],
})
export class WssModule {}
