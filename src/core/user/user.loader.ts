import { Injectable } from '@nestjs/common';

import DataLoader from 'dataloader';

import { ILoader } from '../../common/loader/loader.interface';

import { User } from './user.entity';
import { UserService } from './user.service';

@Injectable()
export class UserLoader implements ILoader {
  constructor(private readonly userService: UserService) {}

  // tslint:disable-next-line: no-any
  public generateDataLoader(): DataLoader<any, any> {
    return new DataLoader<string, User>(this.userService.findByIds);
  }
}
