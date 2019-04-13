import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { forwardRef, Module } from '@nestjs/common';

import config from 'config';

import { LoggerModule } from '../common/logger/logger.module';

import { RabbitService } from './rabbitmq.service';

import { UserModule } from 'src/user/user.module';

const rabbitSettings: IRabbitMQSettings = config.get('RABBITMQ_SETTINGS');

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => LoggerModule),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'auth_service',
        },
      ],
      uri: `amqp://${rabbitSettings.username}:${rabbitSettings.password}@${rabbitSettings.host}:${
        rabbitSettings.port
      }/${rabbitSettings.vhost}`,
    }),
  ],
  providers: [RabbitService],
})
export class RabbitModule {}
