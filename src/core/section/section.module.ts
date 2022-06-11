import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Section } from './section.entity';
import { SectionResolver } from './section.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Section])],
  providers: [SectionResolver],
  exports: [],
})
export class SectionModule {}
