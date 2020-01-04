import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ServiceHelper } from '../../common/helpers/module/service.helper';

import { Book } from './book.entity';

@Injectable()
export class BookService extends ServiceHelper<Book> {
  constructor(@InjectRepository(Book) bookRepository: Repository<Book>) {
    super(bookRepository);
  }
}
