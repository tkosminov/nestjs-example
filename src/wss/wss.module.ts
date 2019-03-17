import { Module } from '@nestjs/common';
import { LoggerService } from '../common/logger/logger.service';

import { WssGateway } from './wss.gateway';

@Module({
  providers: [
    WssGateway,
    {
      provide: LoggerService,
      useValue: new LoggerService('WebSocketService'),
    },
  ],
})
export class WssModule {}
