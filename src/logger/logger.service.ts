import { Injectable, Logger } from '@nestjs/common';

import config from 'config';

export enum ELogLevel {
  debug,
  info,
  warn,
  error,
}

@Injectable()
export class LoggerService extends Logger {
  private readonly _current_level: ELogLevel = ELogLevel[config.get<ILogSettings>('LOGGER_SETTINGS').level];

  constructor(private readonly _context?: string) {
    super(_context);
  }

  public log(message: unknown, context?: string | Record<string, unknown>) {
    if (this.isValidLevel(ELogLevel.debug)) {
      Logger.log(JSON.stringify(message), JSON.stringify(context) || this._context);
    }
  }

  public info(message: unknown, context?: string | Record<string, unknown>) {
    if (this.isValidLevel(ELogLevel.info)) {
      Logger.log(JSON.stringify(message), JSON.stringify(context) || this._context);
    }
  }

  public warn(message: unknown, context?: string | Record<string, unknown>) {
    if (this.isValidLevel(ELogLevel.warn)) {
      Logger.warn(JSON.stringify(message), JSON.stringify(context) || this._context);
    }
  }

  public error(message: unknown, trace?: string, context?: string | Record<string, unknown>) {
    if (this.isValidLevel(ELogLevel.error)) {
      Logger.error(JSON.stringify(message), trace, JSON.stringify(context) || this._context);
    }
  }

  public isValidLevel(level: ELogLevel): boolean {
    return level >= this._current_level;
  }
}
