import { Injectable, NestMiddleware } from '@nestjs/common';

import config from 'config';
import { NextFunction, Request, Response } from 'express';

import { getAction, getForwardedIp, getIp, getMethod, getOrigin, getPath, getReferrer, getUserAgent } from '../helpers/req.helper';

import { LoggerService } from '../logger/logger.service';
import { LoggerStore } from '../logger/logger.store';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly _settings: ILogSettings = config.get('LOGGER_SETTINGS');

  constructor(private readonly logger: LoggerService) {
    if (process.env.COMMIT_SHORT_SHA) {
      this.logger.warn('BUILD_INFO', { commit_short_sha: process.env.COMMIT_SHORT_SHA });
    }

    if (process.env.PIPELINE_CREATED_AT) {
      this.logger.warn('BUILD_INFO', { pipeline_created_at: process.env.PIPELINE_CREATED_AT });
    }
  }

  public use(req: Request & { logger_store: LoggerStore }, res: Response, next: NextFunction) {
    const logger_store = new LoggerStore(this.logger);
    req.logger_store = logger_store;

    if (req.body && req.body.operationName === 'IntrospectionQuery') {
      return next();
    }

    const action = getAction(req);

    if (this._settings.silence.includes(action)) {
      return next();
    }

    req.on('error', (error: Error) => {
      logger_store.error(error.message, error.stack, { statusCode: req.statusCode });
    });

    res.on('error', (error: Error) => {
      logger_store.error(error.message, error.stack, { statusCode: req.statusCode });
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
        logger_store.error(message, '', { statusCode: res.statusCode, statusMessage: res.statusMessage });
      }
    });

    return next();
  }
}
