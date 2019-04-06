import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

import DataLoader from 'dataloader';

import { ILoader } from '../common/loader/loader.interface';

import { User } from '../user/user.entity';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionLoader implements ILoader {
  // tslint:disable-next-line: no-any
  public generateDataLoader(): DataLoader<any, any> {
    return new DataLoader<string, Permission[]>(this.findByUserIds);
  }

  private async findByUserIds(ids: string[]) {
    const users = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.permissions', 'permission')
      .where('user.id IN (:...ids)', { ids })
      .getMany();

    return users.map(user => user.permissions);
  }
}
