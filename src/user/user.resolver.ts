// import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from './user.entity';
// import { UserGuard } from './user.guard';
import { UserService } from './user.service';

import { CreateUserDTO } from './dto/create.dto';

// tslint:disable-next-line: no-unsafe-any
@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // tslint:disable-next-line: no-unsafe-any
  @Query('findUsers')
  public async findUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  // tslint:disable-next-line: no-unsafe-any
  @Mutation('createUser')
  public async createUser(@Args('createUserInput') createUserInput: CreateUserDTO): Promise<User> {
    return await this.userService.create(createUserInput);
  }
}
