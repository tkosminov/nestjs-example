import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

export interface IDBSettings {
  readonly host?: string;
  readonly port?: number;
  readonly username?: string;
  readonly password?: string;
  readonly database: string;
  readonly logging: LoggerOptions;
  readonly synchronize: boolean;
}
