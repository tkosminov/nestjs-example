import { Injectable, Logger } from '@nestjs/common';
import config from 'config';
import { Logger as ISQLLogger, QueryRunner } from 'typeorm';

enum ELogLevel {
  debug,
  info,
  warn,
  error,
}

@Injectable()
export class LoggerService extends Logger implements ISQLLogger {
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

  // tslint:disable-next-line: no-any
  public logQuery(query: string, _parameters?: any[], queryRunner?: QueryRunner) {
    if (queryRunner.connection.options.maxQueryExecutionTime) {
      return;
    }
    this.info(query);
  }

  // tslint:disable-next-line: no-any
  public logQueryError(error: string, _query: string, _parameters?: any[], _queryRunner?: QueryRunner) {
    this.error(error);
  }

  // tslint:disable-next-line: no-any
  public logQuerySlow(time: number, query: string, _parameters?: any[], _queryRunner?: QueryRunner) {
    this.info(`\x1b[35m(${time} ms)\x1b[0m ${query}`);
  }
  public logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    this.log(message);
  }
  public logMigration(message: string, _queryRunner?: QueryRunner) {
    this.log(message);
  }

  private isValidLevel(level: ELogLevel): boolean {
    return level >= this._currentLevel;
  }
}
