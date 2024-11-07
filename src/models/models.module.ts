import { Module } from '@nestjs/common';

import { BookModule } from './book/book.module';
import { SectionModule } from './section/section.module';

@Module({
  imports: [BookModule, SectionModule],
  exports: [BookModule, SectionModule],
})
export class ModelsModule {}
