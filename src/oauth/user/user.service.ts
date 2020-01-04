import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ServiceHelper } from '../../common/helpers/module/service.helper';

import { User } from './user.entity';

@Injectable()
export class UserService extends ServiceHelper<User> {
  constructor(@InjectRepository(User) userRepository: Repository<User>) {
    super(userRepository);
  }
}
