import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from './refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
})
export class RefreshTokenModule {}
