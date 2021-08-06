import { Injectable, Logger } from '@nestjs/common';

import config from 'config';

enum ELogLevel {
  debug,
  info,
  warn,
  error,
}

@Injectable()
export class LoggerService extends Logger {
  private readonly _currentLevel: ELogLevel =
    ELogLevel[config.get<ILogSettings>('LOGGER_SETTINGS').level];

  constructor(private readonly _context?: string) {
    super(_context);
  }

  public log(message: unknown, context?: string) {
    if (this.isValidLevel(ELogLevel.debug)) {
      Logger.log(JSON.stringify(message), context || this._context);
    }
  }

  public info(message: unknown, context?: string) {
    if (this.isValidLevel(ELogLevel.info)) {
      Logger.log(JSON.stringify(message), context || this._context);
    }
  }

  public warn(message: unknown, context?: string) {
    if (this.isValidLevel(ELogLevel.warn)) {
      Logger.warn(JSON.stringify(message), context || this._context);
    }
  }

  public error(message: unknown, trace?: string, context?: string) {
    if (this.isValidLevel(ELogLevel.error)) {
      Logger.error(JSON.stringify(message), trace, context || this._context);
    }
  }

  private isValidLevel(level: ELogLevel): boolean {
    return level >= this._currentLevel;
  }
}
