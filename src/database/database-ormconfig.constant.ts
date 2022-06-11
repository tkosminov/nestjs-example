import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';

import { IDBSettings } from './database.types';

const settings: IDBSettings = config.get('DB_SETTINGS');

export function getOrmConfig(): TypeOrmModuleOptions {
  let ormConfig: TypeOrmModuleOptions;
  if (process.env.NODE_ENV !== 'test') {
    ormConfig = {
      type: 'postgres',
      host: process.env.DB_HOST || settings.host,
      port: (process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : null) || settings.port || 5432,
      username: process.env.DB_USERNAME || settings.username,
      password: process.env.DB_PASSWORD || settings.password,
      database: `${process.env.NODE_ENV}_${settings.database}`,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: true,
      synchronize: settings.synchronize || false,
      logging: settings.logging,
      extra: {
        connectionLimit: 15,
      },
    };
  } else {
    ormConfig = {
      type: 'sqlite',
      database: ':memory:',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: true,
      synchronize: true,
    };
  }

  return ormConfig;
}
