// import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from './user.entity';
// import { UserGuard } from './user.guard';
import { UserService } from './user.service';

import { LoginUserDTO } from './dto/login.dto';
import { PossUserDTO } from './dto/update.dto';

// tslint:disable: no-unsafe-any
@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('findUser')
  public async findUser(@Args('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Query('findUsers')
  public async findUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Mutation('createUser')
  public async createUser(@Args('createUserInput') createUserInput: LoginUserDTO): Promise<User> {
    return await this.userService.create(createUserInput);
  }

  @Mutation('updateUser')
  public async updateUser(
    @Args('id') id: string,
    @Args('updateUserInput') updateUserInput: PossUserDTO
  ): Promise<User> {
    return this.userService.update(id, updateUserInput);
  }

  @Mutation('deleteUser')
  public async deleteUser(@Args('id') id: string): Promise<User> {
    return await this.userService.delete(id);
  }
}
// tslint:enable: no-unsafe-any
