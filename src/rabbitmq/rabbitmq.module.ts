import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { forwardRef, Module } from '@nestjs/common';

import config from 'config';

import { LoggerModule } from '../common/logger/logger.module';

import { UserAMQPService } from './services/user.service';

import { UserModule } from '../core/user/user.module';

const rabbitSettings: IRabbitMQSettings = config.get('RABBITMQ_SETTINGS');

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => LoggerModule),
    RabbitMQModule.forRoot({
      prefetchCount: 1,
      defaultRpcErrorBehavior: 0, // ack!
      defaultSubscribeErrorBehavior: 0, // ack!
      exchanges: [
        {
          name: 'api_1',
        },
      ],
      uri: `amqp://${rabbitSettings.username}:${rabbitSettings.password}@${rabbitSettings.host}:${
        rabbitSettings.port
      }/${rabbitSettings.vhost}`,
    }),
  ],
  providers: [UserAMQPService],
})
export class RabbitModule {}
