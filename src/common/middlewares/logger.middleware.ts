import { Injectable, NestMiddleware } from '@nestjs/common';
import config from 'config';
import { NextFunction, Request, Response } from 'express';

import { ReqHelper } from '../helpers/req.helper';

import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware extends ReqHelper implements NestMiddleware {
  private readonly _settings: ILogSettings = config.get('LOGGER_SETTINGS');

  constructor(private readonly logger: LoggerService) {
    super();
  }

  public use(req: Request, res: Response, next: NextFunction) {
    const action = this.getUrl(req).split('/')[1];
    if (this._settings.silence.includes(action)) {
      return next();
    }

    const startTime = process.hrtime();

    req.on('error', (error: Error) => {
      this.logMethodByStatus(JSON.stringify(error.message, null, 2), error.stack, req.statusCode);
    });

    res.on('error', (error: Error) => {
      this.logMethodByStatus(JSON.stringify(error.message, null, 2), error.stack, res.statusCode);
    });

    res.on('finish', () => {
      const diff = process.hrtime(startTime);

      const message = {
        method: req.method,
        url: this.getUrl(req),
        referrer: this.getReferrer(req),
        userAgent: this.getUserAgent(req),
        remoteAddress: this.getIp(req),
        httpVersion: `HTTP/${this.getHttpVersion(req)}`,
        contentLength: this.getResponseHeader(res, 'content-length'),
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        requestRunTime: `${(diff[0] * 1e3 + diff[1] * 1e-6).toFixed(4)} ms`,
      };

      this.logMethodByStatus(JSON.stringify(message, null, 2), '', res.statusCode);
    });

    return next();
  }

  private logMethodByStatus(message: string, stack: string, statusCode: number = 500) {
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
