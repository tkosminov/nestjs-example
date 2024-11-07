import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import {
  AmqpConnection,
  MessageHandlerErrorBehavior,
  RabbitMQModule as NestJSRabbitMQ,
  RABBIT_HANDLER,
  RabbitHandlerConfig,
  RabbitMQConfig,
} from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RabbitMQDiscovery } from './rabbitmq.discovery';
import { RabbitMQService } from './rabbitmq.service';

@Module({})
export class RabbitMQModule implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    @Inject(AmqpConnection) private readonly connection: AmqpConnection,
    private readonly discover: DiscoveryService
  ) {}

  public async onModuleInit() {
    const RABBITMQ_PREFIX = this.config.get<string>('RABBITMQ_PREFIX');
    const RABBITMQ_EXCHANGE = this.config.getOrThrow<string>('RABBITMQ_EXCHANGE');

    const rabbit_meta = await this.discover.providerMethodsWithMetaAtKey<RabbitHandlerConfig>(RABBIT_HANDLER);

    const exchanges = rabbit_meta.reduce<Set<string>>((acc, curr) => {
      if (curr.meta.exchange && !curr.meta.exchange.startsWith(`${RABBITMQ_PREFIX}${RABBITMQ_EXCHANGE}`)) {
        acc.add(curr.meta.exchange);
      }

      return acc;
    }, new Set([]));

    await new Promise((resolve) => {
      this.connection.managedChannel.waitForConnect(async () => {
        for (const exchange of exchanges) {
          await this.connection.channel.assertExchange(exchange, 'direct');
        }

        return resolve(true);
      });
    });
  }

  public static forRoot(options: Partial<RabbitMQConfig> = {}): DynamicModule {
    return {
      imports: [
        DiscoveryModule,
        NestJSRabbitMQ.forRootAsync(NestJSRabbitMQ, {
          useFactory: (config: ConfigService) => {
            const RABBITMQ_PREFIX = config.get<string>('RABBITMQ_PREFIX');
            const RABBITMQ_EXCHANGE = config.getOrThrow<string>('RABBITMQ_EXCHANGE');
            const RABBITMQ_USERNAME = config.getOrThrow<string>('RABBITMQ_USERNAME');
            const RABBITMQ_PASSWORD = config.getOrThrow<string>('RABBITMQ_PASSWORD');
            const RABBITMQ_HOST = config.getOrThrow<string>('RABBITMQ_HOST');
            const RABBITMQ_PORT = config.getOrThrow<string>('RABBITMQ_PORT');
            const RABBITMQ_VHOST = config.getOrThrow<string>('RABBITMQ_VHOST');

            const default_options: RabbitMQConfig = {
              exchanges: [
                {
                  name: RABBITMQ_EXCHANGE,
                  type: 'direct',
                  options: { durable: true },
                },
              ],
              uri: `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/${RABBITMQ_VHOST}`,
              prefetchCount: 30,
              defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
              connectionInitOptions: { wait: true },
              ...options,
            };

            default_options.exchanges?.forEach((exchange, idx) => {
              default_options.exchanges![idx] = {
                name: `${RABBITMQ_PREFIX}${exchange.name}`,
                type: exchange.type ?? 'direct',
                options: exchange.options || { durable: true },
              };
            });

            return default_options;
          },
          inject: [ConfigService],
        }),
      ],
      providers: [RabbitMQDiscovery, RabbitMQService],
      exports: [RabbitMQService],
      module: RabbitMQModule,
    };
  }
}
