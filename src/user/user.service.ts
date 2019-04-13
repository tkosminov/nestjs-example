import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { User } from './user.entity';

import { CreateUserDTO } from './dto/create.dto';
import { LoginUserDTO } from './dto/login.dto';
import { UpdateUserDTO } from './dto/update.dto';

import { passwordToHash } from '../common/helpers/pswd.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async login(user: LoginUserDTO) {
    //tslint:disable-next-line:no-feature-envy
    const model = await this.userRepository.findOne(
      {
        email: user.email,
        password: passwordToHash(user.password),
      },
      { relations: ['permissions'] }
    );

    if (!model) {
      throw new NotFoundException(`Invalid email or password`);
    }

    return model;
  }

  public async findAll(options: FindManyOptions<User> = {}) {
    return await this.userRepository.find(options);
  }

  public async findOne(id: string, options: FindOneOptions<User> = {}) {
    return await this.userRepository.findOne(id, options);
  }

  public async findByIds(ids: string[], options: FindManyOptions<User> = {}) {
    return await this.userRepository.findByIds(ids, options);
  }

  public async create(user: CreateUserDTO) {
    const model = await this.userRepository.create(user);
    return await this.userRepository.save(model);
  }

  public async update(id: string, user: UpdateUserDTO) {
    const model = await this.userRepository.findOne(id);
    return await this.userRepository.save(Object.assign(model, user));
  }

  public async delete(id: string) {
    const model = await this.userRepository.findOne(id);
    await this.userRepository.delete(model.id);
    return model;
  }

  public async save(user: User) {
    return await this.userRepository.save(user);
  }
}
