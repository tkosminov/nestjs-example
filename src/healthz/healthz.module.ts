import { Module } from '@nestjs/common';

import { HealthzController } from './healthz.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [HealthzController],
  exports: [],
})
export class HealthzModule {}
