import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { HealthzModule } from './healthz/healthz.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { OAuthMiddleware } from './oauth/oauth.middleware';
import { OAuthModule } from './oauth/oauth.module';
import { WssModule } from './wss/wss.module';
import { RedisModule } from './redis/redis.module';
import GraphQLModule from './graphql/graphql.module';
import { CoreModule } from './core/core.module';
import { UploadModule } from './upload/upload.module';
// import { RouteScanModule } from './route-scan/route-scan.module';
// import { RmqModule } from './rmq/rmq.module';

@Module({
  imports: [LoggerModule, HealthzModule, DatabaseModule, RedisModule, OAuthModule, WssModule, GraphQLModule, CoreModule, UploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer
      .apply(OAuthMiddleware)
      .exclude(
        { path: 'oauth/token', method: RequestMethod.ALL },
        { path: 'oauth/registration', method: RequestMethod.ALL },
        { path: 'oauth/change_password', method: RequestMethod.ALL },
        { path: 'swagger', method: RequestMethod.ALL },
        { path: 'healthz', method: RequestMethod.ALL },
        { path: 'graphql-schema/reload', method: RequestMethod.ALL },
        { path: 'graphql', method: RequestMethod.ALL }, // REMOVE THIS
        { path: 'upload', method: RequestMethod.ALL } // REMOVE THIS
      )
      .forRoutes('*');
  }
}
