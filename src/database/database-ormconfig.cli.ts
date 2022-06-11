import { DataSource, DataSourceOptions } from 'typeorm';

import { getOrmConfig } from './database-ormconfig.constant';

export default new DataSource({
  ...(getOrmConfig() as DataSourceOptions),
});
