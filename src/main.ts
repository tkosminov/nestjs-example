import { graphqlUploadExpress } from '@apollographql/graphql-upload-8-fork';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { json, urlencoded } from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Redis } from 'ioredis';

import { AppModule } from './app.module';

import { corsOptionsDelegate } from './cors.option';
import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis/redis.constants';
import { CustomRedisIoAdapter } from './socket/socket.adapter';

const appSettings = config.get<IAppSettings>('APP_SETTINGS');
const redisSettings = config.get<IRedisSettings>('REDIS_SETTINGS');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    bodyParser: true,
  });

  app.use(json({ limit: appSettings.bodyLimit }));
  app.use(
    urlencoded({
      limit: appSettings.bodyLimit,
      extended: true,
      parameterLimit: appSettings.bodyParameterLimit,
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(cookieParser());
  app.enableCors(corsOptionsDelegate);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  if (redisSettings.use) {
    const pubClient: Redis = app.get(REDIS_PUBLISHER_CLIENT);
    const subClient: Redis = app.get(REDIS_SUBSCRIBER_CLIENT);

    app.useWebSocketAdapter(
      new CustomRedisIoAdapter(app, subClient, pubClient),
    );
  } else {
    app.useWebSocketAdapter(new IoAdapter(app));
  }

  app.use(
    graphqlUploadExpress({
      maxFileSize: appSettings.bodyParameterLimit,
      maxFiles: 2,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('NestJS Example')
    .setDescription('NestJS Example API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(appSettings.port);
}

bootstrap();
