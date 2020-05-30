import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { GraphQLUpload } from 'apollo-server-core';
import { FileUpload } from 'graphql-upload';

import { UploadService } from './upload.service';

import { UploadPayload } from './payload/upload.payload';

@Resolver(() => UploadPayload)
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => UploadPayload)
  public async singleUpload(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload) {
    return await this.uploadProcess(file);
  }

  @Mutation(() => [UploadPayload])
  public async multipleUpload(@Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[]) {
    return await Promise.all(
      files.map((file) => {
        return this.uploadProcess(file);
      })
    );
  }

  private async uploadProcess(file: FileUpload) {
    const res = await this.uploadService.storeFileByFs(file);

    return {
      url: res.filePath,
    };
  }
}
