import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule as NestJSGraphQLModule } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { JwtModule } from '../jwt/jwt.module';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { GraphQLOptions } from './graphql.options';
import { GraphQLReloaderModule } from './reloader/reloader.module';
import { GraphQLStitchingModule } from './stitching/stitching.module';

export const GRAPHQL_SUBSCRIPTION = 'GRAPHQL_SUBSCRIPTION';

@Global()
@Module({
  imports: [
    RedisModule,
    NestJSGraphQLModule.forRootAsync<YogaDriverConfig>({
      imports: [JwtModule, GraphQLReloaderModule, GraphQLStitchingModule],
      useClass: GraphQLOptions,
      driver: YogaDriver,
    }),
  ],
  providers: [
    {
      provide: GRAPHQL_SUBSCRIPTION,
      useFactory: (redis: RedisService) =>
        new RedisPubSub({
          publisher: redis.pub_client,
          subscriber: redis.sub_client,
        }),
      inject: [RedisService],
    },
  ],
  exports: [GRAPHQL_SUBSCRIPTION],
})
export class GraphQLModule {}
