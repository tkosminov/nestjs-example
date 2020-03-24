import { Module } from '@nestjs/common';

import { LoggerService } from '../logger/logger.service';

import { SocketGateway } from './socket.gateway';

@Module({
  imports: [],
  providers: [
    SocketGateway,
    {
      provide: LoggerService,
      useValue: new LoggerService('SocketModule'),
    },
  ],
  exports: [SocketGateway],
  controllers: [],
})
export class SocketModule {}
