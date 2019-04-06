import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { LoggerModule } from './common/logger/logger.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

import { LoaderInterceptor } from './common/loader/loader.interceptor';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { WssModule } from './wss/wss.module';

import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    WssModule,
    AuthModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
    UserModule,
    PermissionModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoaderInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  // tslint:disable-next-line: no-feature-envy
  public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes('*');
  }
}
