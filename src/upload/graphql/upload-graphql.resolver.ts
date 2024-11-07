import { Args, Context, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { Mutation } from 'nestjs-graphql-easy';

import { LoggerStore } from '../../logger/logger.store';
import { IJwtPayload } from '../../oauth/user/user.entity';
import { UploadDTO } from './dto/upload.object';
import { UploadGraphQLService } from './upload-graphql.service';

@Resolver(() => UploadDTO)
export class UploadGraphQLResolver {
  constructor(private readonly upload_service: UploadGraphQLService) {}

  @Mutation(() => UploadDTO)
  protected async singleUpload(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Context('current_user') current_user: IJwtPayload,
    @Context('logger_store') logger_store: LoggerStore
  ) {
    return this.upload_service.save(file, logger_store, current_user);
  }
}
