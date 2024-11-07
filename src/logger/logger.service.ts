import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { filterContext, filterMessage } from './logger.filter';

export enum ELogLevel {
  debug,
  info,
  warn,
  error,
}

export interface ILogBase {
  message: unknown;
  trace?: string;
  context: Record<string, unknown>;
}

export interface ILog extends ILogBase {
  level: ELogLevel;
}

@Injectable()
export class LoggerService {
  private readonly _current_level: ELogLevel;
  private readonly app_name: string;
  private readonly keywords: string[] = [];

  constructor(private readonly config: ConfigService) {
    this._current_level = ELogLevel[this.config.getOrThrow<keyof ELogLevel>('LOGGER_LEVEL')];
    this.app_name = this.config.getOrThrow<string>('APP_NAME');
    this.keywords = JSON.parse(this.config.getOrThrow<string>('LOGGER_KEYWORDS'));
  }

  public log(message: unknown, context: Record<string, unknown> = {}) {
    this.addLog({ level: ELogLevel.debug, message, context });
  }

  public info(message: unknown, context: Record<string, unknown> = {}) {
    this.addLog({ level: ELogLevel.info, message, context });
  }

  public warn(message: unknown, context: Record<string, unknown> = {}) {
    this.addLog({ level: ELogLevel.warn, message, context });
  }

  public error(err: Error, context?: Record<string, unknown>): void;
  public error(message: unknown, context?: Record<string, unknown>, trace?: string): void;
  public error(message_or_error: unknown | Error, context: Record<string, unknown> = {}, trace?: string) {
    if (message_or_error instanceof Error) {
      this.addLog({
        level: ELogLevel.error,
        message: message_or_error.message,
        trace: message_or_error.stack,
        context,
      });
    } else {
      this.addLog({ level: ELogLevel.error, message: message_or_error, context, trace });
    }
  }

  public isValidLevel(level: ELogLevel): boolean {
    return level <= this._current_level;
  }

  public addLog(log: ILog) {
    if (this.isValidLevel(log.level)) {
      const msg = JSON.stringify(filterMessage(this.keywords, log.message));
      const ctx = filterContext(this.keywords, log.context);

      ctx.app_name = this.app_name;

      switch (log.level) {
        case ELogLevel.warn:
          Logger.warn(msg, JSON.stringify(ctx));
          break;
        case ELogLevel.error:
          Logger.error(msg, log.trace, JSON.stringify(ctx));
          break;
        default:
          Logger.log(msg, JSON.stringify(ctx));
          break;
      }
    }
  }
}
