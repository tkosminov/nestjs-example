import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { forwardRef, Module } from '@nestjs/common';
import { connect } from 'amqplib';

import config from 'config';

import { LoggerService } from '../common/logger/logger.service';

import { RabbitPublishService } from './services/publish.service';
import { UserAMQPService } from './services/user.service';

import { UserModule } from '../core/user/user.module';

const rabbitSettings: IRabbitMQSettings = config.get('RABBITMQ_SETTINGS');

// tslint:disable-next-line: max-line-length
const rabbitUrl = `amqp://${rabbitSettings.username}:${rabbitSettings.password}@${rabbitSettings.host}:${rabbitSettings.port}/${rabbitSettings.vhost}`;

@Module({
  imports: [
    forwardRef(() => UserModule),
    RabbitMQModule.forRoot({
      prefetchCount: 1,
      defaultRpcErrorBehavior: 0, // ack!
      defaultSubscribeErrorBehavior: 0, // ack!
      exchanges: [
        {
          name: rabbitSettings.exchange,
          type: 'direct',
        },
      ],
      uri: rabbitUrl,
    }),
  ],
  providers: [
    UserAMQPService,
    RabbitPublishService,
    {
      provide: 'AQMP_CHANNEL',
      useFactory: async () => {
        const connection = await connect(rabbitUrl);
        return await connection.createChannel();
      },
    },
    {
      provide: LoggerService,
      useValue: new LoggerService('RabbitMQModule'),
    },
  ],
  exports: [RabbitPublishService],
})
export class RabbitModule {}
