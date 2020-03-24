import { Module } from '@nestjs/common';

import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';

@Module({
  imports: [],
  providers: [UploadService, UploadResolver],
  exports: [],
})
export class GraphQLUploadModule {}
