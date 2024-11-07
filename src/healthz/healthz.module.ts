import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthzController } from './healthz.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthzController],
})
export class HealthzModule {}
