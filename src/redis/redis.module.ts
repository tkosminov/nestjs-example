import { Module } from '@nestjs/common';

import { RedisClient } from './redis.client';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisClient, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
