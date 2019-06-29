import { Module } from '@nestjs/common';

import { LoggerService } from '../../common/logger/logger.service';

import { StitchingService } from './stitching.service';

@Module({
  providers: [
    StitchingService,
    {
      provide: LoggerService,
      useValue: new LoggerService('StitchingService'),
    },
  ],
  exports: [StitchingService],
})
export class StitchingModule {}
