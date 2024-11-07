import { Module } from '@nestjs/common';

import { LoggerModule } from '../../logger/logger.module';
import { GraphQLStitchingService } from './stitching.service';

@Module({
  imports: [LoggerModule],
  providers: [GraphQLStitchingService],
  exports: [GraphQLStitchingService],
})
export class GraphQLStitchingModule {}
