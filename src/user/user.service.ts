import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

import { CreateUserDTO } from './dto/create.dto';
import { UpdateUserDTO } from './dto/update.dto';

import { RepositoryHelper } from '../common/helpers/repository.helper';

@Injectable()
export class UserService extends RepositoryHelper<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(userRepository);
  }

  public async create(user: CreateUserDTO) {
    const model = await this.userRepository.create(user);
    return await this.userRepository.save(model);
  }

  public async update(id: string, user: UpdateUserDTO) {
    const model = await this.userRepository.findOne(id);
    return await this.userRepository.save(Object.assign(model, user));
  }

  public async save(user: User) {
    return await this.userRepository.save(user);
  }
}
