import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecoveryKey } from './recovery-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecoveryKey])],
  providers: [],
  exports: [],
})
export class RecoveryKeyModule {}
