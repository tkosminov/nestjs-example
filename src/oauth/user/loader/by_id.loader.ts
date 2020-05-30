import { Injectable } from '@nestjs/common';

import DataLoader from 'dataloader';
import { getRepository, In } from 'typeorm';

import { ILoader } from '../../../graphql/loader/loader.interface';

import { User } from '../user.entity';

@Injectable()
export class UserLoaderById implements ILoader {
  public generateDataLoader(): DataLoader<string, User> {
    return new DataLoader<string, User>(this.findById);
  }

  private async findById(ids: string[]) {
    const users = await getRepository(User).find({ where: { id: In(ids) } });
    return ids.map((id) => users.find((u) => u.id === id));
  }
}
