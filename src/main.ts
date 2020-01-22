import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { json, urlencoded } from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import helmet from 'helmet';

import { AppModule } from './app.module';
import corsOptions from './cors.option';

const appSettings = config.get<IAppSettings>('APP_SETTINGS');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    bodyParser: true,
  });

  app.use(json({ limit: appSettings.bodyLimit }));
  app.use(urlencoded({ limit: appSettings.bodyLimit, extended: true, parameterLimit: appSettings.bodyParameterLimit }));
  app.use(helmet());
  app.use(cookieParser());
  app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.useWebSocketAdapter(new IoAdapter(app));

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
