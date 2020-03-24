import { Injectable } from '@nestjs/common';
import { getRepository, In } from 'typeorm';

import DataLoader from 'dataloader';
import { ILoader } from '../../../graphql/loader/loader.interface';

import { Book } from '../book.entity';

@Injectable()
export class BookLoaderById implements ILoader {
  public generateDataLoader(): DataLoader<string, Book> {
    return new DataLoader<string, Book>(this.findById);
  }

  private async findById(ids: string[]) {
    const books = await getRepository(Book).find({ where: { id: In(ids) } });
    return ids.map((id) => books.find((b) => b.id === id));
  }
}
