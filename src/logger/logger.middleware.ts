import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

import { getAction, getForwardedIp, getIp, getMethod, getOrigin, getPath, getReferrer, getUserAgent } from '../utils/request';
import { LoggerService } from './logger.service';
import { LoggerStore } from './logger.store';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly silence: string[] = [];

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService
  ) {
    this.silence = JSON.parse(this.config.getOrThrow<string>('LOGGER_SILENCE'));
  }

  public use(req: Request & { logger_store: LoggerStore }, res: Response, next: NextFunction) {
    const logger_store = new LoggerStore(this.logger);
    req.logger_store = logger_store;

    if (this.silence.includes(getAction(req))) {
      return next();
    }

    req.on('error', (error: Error) => {
      logger_store.error(error, { statusCode: req.statusCode });
    });

    res.on('error', (error: Error) => {
      logger_store.error(error, { statusCode: req.statusCode });
    });

    res.on('finish', () => {
      const message = {
        method: getMethod(req),
        path: getPath(req),
        referrer: getReferrer(req),
        origin: getOrigin(req),
        userAgent: getUserAgent(req),
        remoteAddress: getIp(req),
        forwardedAddress: getForwardedIp(req),
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      };

      if (res.statusCode < 200) {
        logger_store.log(message, { statusCode: res.statusCode, statusMessage: res.statusMessage });
      } else if (res.statusCode < 300) {
        logger_store.info(message, { statusCode: res.statusCode, statusMessage: res.statusMessage });
      } else if (res.statusCode < 400) {
        logger_store.warn(message, { statusCode: res.statusCode, statusMessage: res.statusMessage });
      } else {
        logger_store.error(message, { statusCode: res.statusCode, statusMessage: res.statusMessage });
      }
    });

    return next();
  }
}
