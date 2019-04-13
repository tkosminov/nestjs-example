import { Injectable, NestMiddleware } from '@nestjs/common';
import config from 'config';
import { NextFunction, Request, Response } from 'express';

import { LoggerService } from '../logger/logger.service';

import { ReqHelper } from '../helpers/req.helper';

@Injectable()
export class LoggerMiddleware extends ReqHelper implements NestMiddleware {
  private readonly _settings: ILogSettings = config.get('LOGGER_SETTINGS');

  constructor(private readonly logger: LoggerService) {
    super();
  }

  public use(req: Request, res: Response, next: NextFunction) {
    if (this._settings.silence.includes(this.getUrl(req))) {
      return next();
    }

    const startTime = process.hrtime();
    res.on('finish', () => {
      const diff = process.hrtime(startTime);
      const message = `${this.getIp(req)} - "${req.method} ${this.getUrl(req)} HTTP/${this.getHttpVersion(req)}" ${
        res.statusCode
      } ${this.getResponseHeader(res, 'content-length')} "${this.getReferrer(req)}" "${this.getUserAgent(req)}" - ${(
        diff[0] * 1e3 +
        diff[1] * 1e-6
      ).toFixed(4)} ms`;
      this.logMethodByStatus(message, res.statusCode);
    });

    return next();
  }

  private logMethodByStatus(message: string, statusCode: number = 500) {
    const prefix = 'LoggerMiddleware';
    if (statusCode < 300) {
      return this.logger.info(message, prefix);
    } else if (statusCode < 400) {
      return this.logger.log(message, prefix);
    } else if (statusCode < 500) {
      return this.logger.warn(message, prefix);
    } else {
      return this.logger.error(message, '', prefix);
    }
  }
}
