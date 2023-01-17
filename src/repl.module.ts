import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { HealthzModule } from './healthz/healthz.module';
import { LoggerModule } from './logger/logger.module';
import { OAuthModule } from './oauth/oauth.module';
import { RedisModule } from './redis/redis.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [LoggerModule, HealthzModule, DatabaseModule, RedisModule, OAuthModule, CoreModule],
  controllers: [],
  providers: [],
})
export class ReplModule {}
