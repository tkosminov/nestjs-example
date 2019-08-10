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
  // tslint:disable-next-line: no-unsafe-any
  private readonly _currentLevel: ELogLevel = ELogLevel[config.get<ILogSettings>('LOGGER_SETTINGS').level];

  constructor(private readonly _context?: string) {
    super(_context);
  }

  // tslint:disable-next-line: no-any
  public log(message: any, context?: string) {
    if (this.isValidLevel(ELogLevel.debug)) {
      Logger.log(JSON.stringify(message, null, 2), context || this._context);
    }
  }
  // tslint:disable-next-line: no-any
  public info(message: any, context?: string) {
    if (this.isValidLevel(ELogLevel.info)) {
      Logger.log(JSON.stringify(message, null, 2), context || this._context);
    }
  }
  // tslint:disable-next-line: no-any
  public warn(message: any, context?: string) {
    if (this.isValidLevel(ELogLevel.warn)) {
      Logger.warn(JSON.stringify(message, null, 2), context || this._context);
    }
  }
  // tslint:disable-next-line: no-any
  public error(message: any, trace?: string, context?: string) {
    if (this.isValidLevel(ELogLevel.error)) {
      Logger.error(JSON.stringify(message, null, 2), trace, context || this._context);
    }
  }

  private isValidLevel(level: ELogLevel): boolean {
    return level >= this._currentLevel;
  }
}
