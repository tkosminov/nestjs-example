import { ConnectionOptions } from 'typeorm';

import { getOrmConfig } from './database-ormconfig.constant';

const databaseConnectionTestConfiguration: Partial<ConnectionOptions> = {
  ...getOrmConfig(),
};

export = databaseConnectionTestConfiguration;
