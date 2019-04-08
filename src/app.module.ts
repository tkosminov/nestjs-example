import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LoggerModule } from './common/logger/logger.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

import { LoaderInterceptor } from './common/loader/loader.interceptor';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { WssModule } from './wss/wss.module';

import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';

import GraphQLModule from './gql/gql.module';

@Module({
  imports: [GraphQLModule, DatabaseModule, LoggerModule, WssModule, AuthModule, UserModule, PermissionModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoaderInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes('*');
  }
}
