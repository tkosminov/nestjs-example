import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

import config from 'config';
import { NextFunction } from 'express';
import { Redis } from 'ioredis';
import { Server, ServerOptions, Socket } from 'socket.io';
import { createAdapter, RedisAdapterOptions } from 'socket.io-redis';
import { verify } from 'jsonwebtoken';

import { access_denied, account_blocked, jwt_token_expired_signature } from '../errors';
import { cors_options_delegate } from '../cors.options';
import { IJwtPayload } from '../oauth/user/user.entity';

const redis_settings = config.get<IRedisSettings>('REDIS_SETTINGS');
const jwt_settings = config.get<IJwtSettings>('JWT_SETTINGS');

export class CustomRedisIoAdapter extends IoAdapter {
  constructor(app: INestApplication, private readonly sub_client: Redis, private readonly pub_client: Redis) {
    super(app);
  }

  public createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, {
      ...options,
      cors: cors_options_delegate,
      allowEIO3: true,
    });

    server.adapter(
      createAdapter({
        host: process.env.REDIS_HOST || redis_settings.host,
        port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : redis_settings.port,
        auth_pass: process.env.REDIS_PASSWORD || redis_settings.password,
        key: process.env.REDIS_KEY || redis_settings.key,
        pubClient: this.pub_client,
        subClient: this.sub_client,
      } as Partial<RedisAdapterOptions>)
    );

    server.use((socket: Socket, next: NextFunction) => {
      try {
        const jwt_token = socket.handshake.auth.token;

        let payload: IJwtPayload;

        if (jwt_token) {
          payload = verify(jwt_token, jwt_settings.secretKey) as IJwtPayload;
        }

        if (payload) {
          if (!payload.is_blocked) {
            return next();
          }

          return next(account_blocked({}, false));
        }

        return next(access_denied({}, false));
      } catch (error) {
        return next(jwt_token_expired_signature({}, false));
      }
    });

    return server;
  }
}
