import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { RestLogger } from '../../logger/logger.decorator';
import { LoggerStore } from '../../logger/logger.store';
import { RestCurrentUser } from '../../oauth/oauth.decorator';
import { IJwtPayload } from '../../oauth/user/user.entity';
import { IFile, UploadRestService } from './upload-rest.service';

@Controller('upload')
export class UploadRestController {
  constructor(private readonly upload_service: UploadRestService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  public async upload(@UploadedFile() file: IFile, @RestCurrentUser() current_user: IJwtPayload, @RestLogger() logger_store: LoggerStore) {
    return await this.upload_service.save(file, logger_store, current_user);
  }
}
