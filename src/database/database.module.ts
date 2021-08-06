import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getOrmConfig } from './database-ormconfig.constant';

@Module({
  imports: [TypeOrmModule.forRoot(getOrmConfig())],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
