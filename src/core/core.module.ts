import { Module } from '@nestjs/common';

import { BookModule } from './book/book.module';

@Module({
  imports: [BookModule],
  providers: [],
  exports: [BookModule],
})
export class CoreModule {}
