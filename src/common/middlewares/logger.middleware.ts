import { Injectable, NestMiddleware } from '@nestjs/common';

import config from 'config';
import { NextFunction, Request, Response } from 'express';

import {
  getIp,
  getMethod,
  getOrigin,
  getReferrer,
  getUrl,
  getUserAgent,
} from '../helpers/req.helper';

import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly settings: ILogSettings = config.get('LOGGER_SETTINGS');

  constructor(private readonly logger: LoggerService) {}

  public use(req: Request, res: Response, next: NextFunction) {
    const operation: string =
      req.body && req.body.operationName ? req.body.operationName : '';
    const action: string = getUrl(req).split('/')[1];

    if (
      this.settings.silence.includes(action) ||
      this.settings.silence.includes(operation)
    ) {
      return next();
    }

    const startTime = process.hrtime();

    req.on('error', (error: Error) => {
      this.logMethodByStatus(error.message, error.stack, req.statusCode);
    });

    res.on('error', (error: Error) => {
      this.logMethodByStatus(error.message, error.stack, res.statusCode);
    });

    res.on('finish', () => {
      const diff = process.hrtime(startTime);

      const message = {
        url: `${getMethod(req)} ${getUrl(req)}`,
        referrer: getReferrer(req),
        origin: getOrigin(req) || '-',
        userAgent: getUserAgent(req),
        remoteAddress: getIp(req),
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        requestRunTime: `${(diff[0] * 1e3 + diff[1] * 1e-6).toFixed(4)} ms`,
      };

      this.logMethodByStatus(message, '', res.statusCode);
    });

    return next();
  }

  private logMethodByStatus(message: unknown, stack: string, statusCode = 500) {
    const prefix = 'LoggerMiddleware';
    if (statusCode < 300) {
      return this.logger.info(message, prefix);
    } else if (statusCode < 400) {
      return this.logger.warn(message, prefix);
    } else {
      return this.logger.error(message, stack, prefix);
    }
  }
}
