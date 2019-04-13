import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

import DataLoader from 'dataloader';

import { ILoader } from '../common/loader/loader.interface';

import { User } from '../user/user.entity';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionLoader implements ILoader {
  public generateDataLoader(): DataLoader<string, Permission[]> {
    return new DataLoader<string, Permission[]>(this.findByUserIds);
  }

  // tslint:disable-next-line: no-feature-envy
  private async findByUserIds(ids: string[]) {
    const users = await getRepository(User).findByIds(ids, { relations: ['permissions'] });

    const permissions = users.reduce((agg, user) => {
      agg[user.id] = user.permissions;
      return agg;
    });

    // tslint:disable-next-line: no-unsafe-any
    return ids.map(id => permissions[id]);
  }
}
