import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_FILE_PATHS, EXPAND_VARIABLES } from './app.env';
import { GraphQLModule } from './graphql/graphql.module';
import { HealthzModule } from './healthz/healthz.module';
import { JwtModule } from './jwt/jwt.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { ModelsModule } from './models/models.module';
import { OAuthMiddleware } from './oauth/oauth.middleware';
import { OAuthModule } from './oauth/oauth.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { RedisModule } from './redis/redis.module';
import { TypeOrmModule } from './typeorm/typeorm.module';
import { UploadModule } from './upload/upload.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: EXPAND_VARIABLES,
      envFilePath: ENV_FILE_PATHS,
    }),
    LoggerModule,
    HealthzModule,
    TypeOrmModule.forRoot(),
    RedisModule,
    RabbitMQModule.forRoot(),
    JwtModule,
    GraphQLModule,
    OAuthModule,
    ModelsModule,
    UploadModule,
    WsModule,
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer.apply(OAuthMiddleware).forRoutes(
      {
        path: 'graphql',
        method: RequestMethod.POST,
      },
      {
        path: 'upload',
        method: RequestMethod.ALL,
      }
    );
  }
}
