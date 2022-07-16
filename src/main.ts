import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import Redis from 'ioredis';

import { AppModule } from './app.module';
import { cors_options_delegate } from './cors.options';
import { HttpExceptionFilter } from './filters/exception.filter';
import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis/redis.constants';
import { CustomRedisIoAdapter } from './wss/wss.adapter';
import { GraphQLSchemaReloadService } from './graphql/schema-reload/schema-reload.service';

const app_settings = config.get<IAppSettings>('APP_SETTINGS');

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    bodyParser: true,
  });

  app.use(json({ limit: app_settings.body_limit }));

  app.use(
    urlencoded({
      limit: app_settings.body_limit,
      extended: true,
      parameterLimit: app_settings.body_parameter_limit,
    })
  );

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(cookieParser());

  app.enableCors(cors_options_delegate);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const pubClient: Redis = app.get(REDIS_PUBLISHER_CLIENT);
  const subClient: Redis = app.get(REDIS_SUBSCRIBER_CLIENT);

  app.useWebSocketAdapter(new CustomRedisIoAdapter(app, subClient, pubClient));

  const options = new DocumentBuilder().setTitle('NestJS-Example').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const schema_loader_service = app.get(GraphQLSchemaReloadService);
  schema_loader_service.applyApp(app);

  await app.listen(app_settings.port);
}

bootstrap();
