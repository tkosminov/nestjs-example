import { Module } from '@nestjs/common';

import { UploadGraphQLModule } from './graphql/upload-graphql.module';
import { UploadRestModule } from './rest/upload-rest.module';

@Module({
  imports: [UploadRestModule, UploadGraphQLModule],
})
export class UploadModule {}
