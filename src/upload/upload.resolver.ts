import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { UploadService } from './upload.service';

import { UploadDTO } from './dto/upload.dto';
import { UploadPayload } from './payload/upload.payload';

// tslint:disable-next-line: no-unsafe-any
@Resolver(() => UploadPayload)
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => UploadPayload)
  public async singleUpload(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Args('data') data: UploadDTO
  ) {
    return await this.uploadProcess(file, data);
  }

  @Mutation(() => [UploadPayload])
  public async multipleUpload(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args('data') data: UploadDTO
  ) {
    return await Promise.all(
      files.map(file => {
        return this.uploadProcess(file, data);
      })
    );
  }

  private async uploadProcess(file: FileUpload, data: UploadDTO) {
    const res = await this.uploadService.storeFileByFs(file, data.modifyNeed);

    return {
      url: res.filePath,
    };
  }
}
