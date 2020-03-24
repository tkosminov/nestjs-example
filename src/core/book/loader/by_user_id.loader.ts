import { Injectable } from '@nestjs/common';
import { getRepository, In } from 'typeorm';

import DataLoader from 'dataloader';
import { ILoader } from '../../../graphql/loader/loader.interface';

import { Book } from '../book.entity';

@Injectable()
export class BookLoaderByUserId implements ILoader {
  public generateDataLoader(): DataLoader<string, Book[]> {
    return new DataLoader<string, Book[]>(this.findByUserId);
  }

  private async findByUserId(ids: string[]) {
    const books = await getRepository(Book).find({ where: { userId: In(ids) } });
    return ids.map((id) => books.filter((b) => b.userId === id));
  }
}
