import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';

import config from 'config';

import { LoggerService } from '../logger/logger.service';

import { RMQ_MODULE_OPTIONS } from './rmq.constants';
import { RmqExplorer } from './rmq.explorer';
import { RmqService } from './rmq.service';

import { RmqRecieveService } from './services/recieve.service';

const rabbit_settings = config.get<IRabbitMQSettings>('RABBITMQ_SETTINGS');

@Module({
  imports: [DiscoveryModule, MetadataScanner],
  providers: [
    {
      provide: LoggerService,
      useValue: new LoggerService('RmqModule'),
    },
    {
      provide: RMQ_MODULE_OPTIONS,
      useValue: {
        exchange: {
          name: rabbit_settings.exchange,
          durable: true,
          type: 'direct',
        },
        connection: {
          login: rabbit_settings.username,
          password: rabbit_settings.password,
          host: rabbit_settings.host,
          port: rabbit_settings.port,
          vhost: rabbit_settings.vhost,
        },
      },
    },
    RmqExplorer,
    RmqService,
    RmqRecieveService,
  ],
  exports: [RmqService],
})
export class RmqModule {}
