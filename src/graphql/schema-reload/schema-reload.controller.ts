import { Controller, Post, UseGuards } from '@nestjs/common';

import { GraphQLSchemaReloadGuard } from './schema-reload.guard';
import { GraphQLSchemaReloadService } from './schema-reload.service';

@UseGuards(new GraphQLSchemaReloadGuard())
@Controller('graphql-schema')
export class GraphQLSchemaReloadController {
  constructor(private readonly schemaReloadService: GraphQLSchemaReloadService) {}

  @Post('reload')
  public async reload() {
    return await this.schemaReloadService.reloadGraphQLSchema(true);
  }
}
