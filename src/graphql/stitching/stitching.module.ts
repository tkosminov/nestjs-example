import { Module } from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';

import { StitchingService } from './stitching.service';

@Module({
  providers: [
    StitchingService,
    {
      provide: LoggerService,
      useValue: new LoggerService('StitchingModule'),
    },
  ],
  exports: [StitchingService],
})
export class StitchingModule {}
