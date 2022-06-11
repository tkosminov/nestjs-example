import { Module } from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';
import { RedisModule } from '../../redis/redis.module';

import { GraphQLSchemaReloadController } from './schema-reload.controller';

import { GraphQLSchemaReloadService } from './schema-reload.service';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: LoggerService,
      useValue: new LoggerService('GraphQLSchemaReloadModule'),
    },
    GraphQLSchemaReloadService,
  ],
  controllers: [GraphQLSchemaReloadController],
  exports: [GraphQLSchemaReloadService],
})
export class GraphQLSchemaReloadModule {}
