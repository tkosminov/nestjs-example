import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './book.entity';
import { BookCreateDTO } from './mutation-input/create.dto';

@Injectable()
export class BookService {
  constructor(@InjectRepository(Book) private readonly repository: Repository<Book>) {}

  public async create(data: BookCreateDTO) {
    const {
      raw: [book],
    }: { raw: [Book] } = await this.repository.createQueryBuilder().insert().values(data).returning('*').execute();

    return book;
  }
}
