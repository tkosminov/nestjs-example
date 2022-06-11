import { Module } from '@nestjs/common';

import { LoggerService } from '../logger/logger.service';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [],
  providers: [
    UploadService,
    {
      provide: LoggerService,
      useValue: new LoggerService('UploadModule'),
    },
  ],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
