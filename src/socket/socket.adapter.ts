import { IoAdapter } from '@nestjs/platform-socket.io';

import IORedis from 'ioredis';
import { Server, ServerOptions } from 'socket.io';
import redisIoAdapter from 'socket.io-redis';

import config from 'config';

const redisSettings = config.get<IRedisSettings>('REDIS_SETTINGS');

export class CustomRedisIoAdapter extends IoAdapter {
  public createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options);

    const pubClient = new IORedis({
      host: redisSettings.host,
      port: redisSettings.port,
      password: redisSettings.password,
    });

    const subClient = new IORedis({
      host: redisSettings.host,
      port: redisSettings.port,
      password: redisSettings.password,
    });

    server.adapter(
      redisIoAdapter({
        host: redisSettings.host,
        port: redisSettings.port,
        auth_pass: redisSettings.password,
        pubClient,
        subClient,
      })
    );

    return server;
  }
}
