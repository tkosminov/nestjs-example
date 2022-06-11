import { Provider } from '@nestjs/common';

import config from 'config';
import IORedis, { Redis } from 'ioredis';

import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis.constants';

const redisSettings = config.get<IRedisSettings>('REDIS_SETTINGS');

export const redisProviders: Provider[] = [
  {
    useFactory: (): Redis => {
      return new IORedis({
        host: redisSettings.host,
        port: redisSettings.port,
        password: redisSettings.password,
      });
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (): Redis => {
      return new IORedis({
        host: redisSettings.host,
        port: redisSettings.port,
        password: redisSettings.password,
      });
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
