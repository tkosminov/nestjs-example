import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { OAuthMiddleware } from './common/middlewares/oauth.middleware';

import { LoaderProvider } from './graphql/loader/loader.prodiver';

// import { AmqpModule } from './amqp/amqp.module';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import GraphQLModule from './graphql/graphql.module';
import { GraphQLUploadModule } from './graphql/upload/upload.module';
import { LoggerModule } from './logger/logger.module';
import { OAuthModule } from './oauth/oauth.module';
import { RedisModule } from './redis/redis.module';
import { SocketModule } from './socket/socket.module';

import { HealthcheckController } from './healthcheck/healthcheck.controller';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    SocketModule,
    RedisModule,
    // AmqpModule,
    GraphQLModule,
    GraphQLUploadModule,
    OAuthModule,
    CoreModule,
  ],
  providers: [LoaderProvider],
  controllers: [HealthcheckController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer
      .apply(OAuthMiddleware)
      .exclude(
        { path: 'oauth', method: RequestMethod.ALL },
        { path: 'healthz', method: RequestMethod.ALL },
        { path: 'swagger', method: RequestMethod.ALL },
      )
      .forRoutes(
        { path: 'graphql', method: RequestMethod.POST },
        { path: 'graphql', method: RequestMethod.OPTIONS },
      );
  }
}
