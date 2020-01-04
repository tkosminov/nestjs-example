import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Book } from './book.entity';
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookService, BookResolver],
  exports: [BookService],
})
export class BookModule {}
