import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

import { CreateUserDTO } from './dto/create.dto';
import { LoginUserDTO } from './dto/login.dto';

import { passwordToHash } from '../common/helpers/pswd.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositoty: Repository<User>
  ) {}

  public async login(user: LoginUserDTO) {
    //tslint:disable-next-line:no-feature-envy
    const model = await this.userRepositoty.findOne({
      email: user.email,
      password: passwordToHash(user.password),
    });

    if (!model) {
      throw new NotFoundException(`Invalid email or password`);
    }

    return model;
  }

  public async findAll() {
    return await this.userRepositoty.find();
  }

  public async findOne(id: string) {
    return await this.userRepositoty.findOne(id);
  }

  public async create(user: CreateUserDTO) {
    const model = await this.userRepositoty.create(user);
    return await this.userRepositoty.save(model);
  }

  // public async update() {

  // }

  public async delete(id: string) {
    const model = await this.userRepositoty.findOne(id);
    await this.userRepositoty.delete(model);
    return model;
  }
}
