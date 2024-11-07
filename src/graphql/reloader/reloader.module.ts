import { Module } from '@nestjs/common';

import { LoggerModule } from '../../logger/logger.module';
import { RedisModule } from '../../redis/redis.module';
import { GraphQLStitchingModule } from '../stitching/stitching.module';
import { GraphQLReloaderController } from './reloader.controller';
import { GraphQLReloaderService } from './reloader.service';

@Module({
  imports: [RedisModule, GraphQLStitchingModule, LoggerModule],
  providers: [GraphQLReloaderService],
  controllers: [GraphQLReloaderController],
})
export class GraphQLReloaderModule {}
