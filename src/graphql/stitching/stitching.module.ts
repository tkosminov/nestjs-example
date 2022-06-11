import { Module } from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';

import { GraphQLStitchingService } from './stitching.service';

@Module({
  providers: [
    GraphQLStitchingService,
    {
      provide: LoggerService,
      useValue: new LoggerService('GraphQLStitchingModule'),
    },
  ],
  exports: [GraphQLStitchingService],
})
export class GraphQLStitchingModule {}
