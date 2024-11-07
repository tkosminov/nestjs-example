import { Module } from '@nestjs/common';

import { UploadGraphQLResolver } from './upload-graphql.resolver';
import { UploadGraphQLService } from './upload-graphql.service';

@Module({
  providers: [UploadGraphQLResolver, UploadGraphQLService],
})
export class UploadGraphQLModule {}
