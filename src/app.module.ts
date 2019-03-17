import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { LoggerModule } from './common/logger/logger.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { WssModule } from './wss/wss.module';

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
  ],
})
export class AppModule implements NestModule {
  // tslint:disable-next-line: no-feature-envy
  public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes('*');
  }
}
