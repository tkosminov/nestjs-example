import { Module } from '@nestjs/common';

import { BookModule } from './book/book.module';
import { SectionModule } from './section/section.module';

@Module({
  imports: [BookModule, SectionModule],
  providers: [],
  exports: [BookModule, SectionModule],
})
export class CoreModule {}
