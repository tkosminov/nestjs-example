import { Controller, Get } from '@nestjs/common';

import { GraphQLReloaderService } from './reloader.service';

@Controller('schema')
export class GraphQLReloaderController {
  constructor(private readonly reloader_service: GraphQLReloaderService) {}

  @Get('reload')
  public async reload() {
    return this.reloader_service.reloadGraphQLSchema(true);
  }
}
