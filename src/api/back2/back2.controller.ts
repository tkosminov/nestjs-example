import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { Back2Service } from './back2.service';

@ApiUseTags('api')
@Controller('v1/back2')
export class Back2Controller {
  constructor(private readonly back2Service: Back2Service) {}

  @Get()
  public async index() {
    return await this.back2Service.index();
  }
}
