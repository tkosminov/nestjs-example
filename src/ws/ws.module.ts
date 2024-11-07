import { Module } from '@nestjs/common';

import { WsGateway } from './ws.gateway';

@Module({
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
