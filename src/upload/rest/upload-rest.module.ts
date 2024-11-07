import { Module } from '@nestjs/common';

import { UploadRestController } from './upload-rest.controller';
import { UploadRestService } from './upload-rest.service';

@Module({
  providers: [UploadRestService],
  controllers: [UploadRestController],
})
export class UploadRestModule {}
