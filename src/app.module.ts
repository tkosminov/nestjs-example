import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LoggerModule } from './common/logger/logger.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';

import { LoaderInterceptor } from './common/loader/loader.interceptor';

// import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import GraphQLModule from './graphql/graphql.module';
// import { RabbitModule } from './rabbitmq/rabbitmq.module';
// import { WssModule } from './wss/wss.module';

import { HealthcheckController } from './healthcheck/healthcheck.controller';

@Module({
  imports: [GraphQLModule, DatabaseModule, LoggerModule, AuthModule, CoreModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoaderInterceptor,
    },
  ],
  controllers: [HealthcheckController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
