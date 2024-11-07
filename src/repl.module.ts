import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_FILE_PATHS, EXPAND_VARIABLES } from './app.env';
import { GraphQLModule } from './graphql/graphql.module';
import { HealthzModule } from './healthz/healthz.module';
import { JwtModule } from './jwt/jwt.module';
import { LoggerModule } from './logger/logger.module';
import { ModelsModule } from './models/models.module';
import { OAuthModule } from './oauth/oauth.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { RedisModule } from './redis/redis.module';
import { TypeOrmModule } from './typeorm/typeorm.module';

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
  ],
})
export class ReplModule {}
