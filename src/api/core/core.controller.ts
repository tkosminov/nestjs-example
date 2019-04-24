import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { CoreService } from './core.service';

@ApiUseTags('api')
@Controller('v1/core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get()
  public async index() {
    return await this.coreService.index();
  }
}
