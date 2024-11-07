import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server, ServerOptions } from 'socket.io';

import { CorsMiddleware } from '../cors/cors.middleware';
import { JwtService } from '../jwt/jwt.service';
import { IAccessToken } from '../oauth/oauth.service';
import { RedisService } from '../redis/redis.service';
import { access_token_expired_signature, authorization_failed, unauthorized } from '../utils/errors';
import { getCookie } from '../utils/request';

export class WsAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService
  ) {
    super(app);
  }

  public createIOServer(port: number, options?: ServerOptions): Server {
    const WS_PORT = parseInt(this.config.getOrThrow<string>('WS_PORT'), 10);
    const WS_PING_INTERVAL = parseInt(this.config.getOrThrow<string>('WS_PING_INTERVAL'), 10);
    const WS_PING_TIMEOUT = parseInt(this.config.getOrThrow<string>('WS_PING_TIMEOUT'), 10);
    const WS_PATH = this.config.getOrThrow<string>('WS_PATH');

    const server: Server = super.createIOServer(port || WS_PORT, {
      pingInterval: WS_PING_INTERVAL,
      pingTimeout: WS_PING_TIMEOUT,
      path: WS_PATH,
      ...options,
      cors: CorsMiddleware({
        allowed_origins: JSON.parse(this.config.getOrThrow<string>('CORS_ALLOWED_ORIGINS')),
        allowed_methods: JSON.parse(this.config.getOrThrow<string>('CORS_ALLOWED_METHODS')),
        allowed_paths: JSON.parse(this.config.getOrThrow<string>('CORS_ALLOWED_PATHS')),
        credentials: this.config.getOrThrow<boolean>('CORS_CREDENTIALS'),
      }),
      allowEIO3: true,
    });

    server.adapter(
      createAdapter(this.redis.pub_client, this.redis.sub_client, {
        key: this.config.getOrThrow<string>('REDIS_KEY'),
      })
    );

    server.use((socket, next) => {
      const access_token = socket.handshake.auth.token || getCookie(socket.handshake.headers.cookie ?? '', 'access_token');

      if (access_token?.length) {
        try {
          const { token_type } = this.jwt.verify<IAccessToken>(access_token);

          if (token_type !== 'access') {
            return next(authorization_failed());
          }

          return next();
        } catch (e) {
          return next(access_token_expired_signature());
        }
      }

      return next(unauthorized());
    });

    return server;
  }
}
