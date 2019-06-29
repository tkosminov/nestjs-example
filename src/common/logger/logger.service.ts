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

  public log(message: string, context?: string) {
    if (this.isValidLevel(ELogLevel.debug)) {
      Logger.log(message, context || this._context);
    }
  }
  public info(message: string, context?: string) {
    if (this.isValidLevel(ELogLevel.info)) {
      Logger.log(message, context || this._context);
    }
  }
  public warn(message: string, context?: string) {
    if (this.isValidLevel(ELogLevel.warn)) {
      Logger.warn(message, context || this._context);
    }
  }
  public error(message: string, trace?: string, context?: string) {
    if (this.isValidLevel(ELogLevel.error)) {
      Logger.error(message, trace, context || this._context);
    }
  }

  private isValidLevel(level: ELogLevel): boolean {
    return level >= this._currentLevel;
  }
}
