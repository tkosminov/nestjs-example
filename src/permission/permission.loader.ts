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

    return ids.map(id => users.find(u => u.id === id).permissions);

    // const permissionMap: Map<string, Permission[]> = new Map();

    // users.forEach(u => {
    //   permissionMap.set(u.id, u.permissions);
    // });

    // // tslint:disable-next-line: no-unsafe-any
    // return ids.map(id => permissionMap[id]);
  }
}
