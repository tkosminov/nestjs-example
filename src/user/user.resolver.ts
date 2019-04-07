// import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import DataLoader from 'dataloader';
import { Loader } from '../common/loader/loader.decorator';

import { User } from './user.entity';
import { UserService } from './user.service';
// import { UserGuard } from './user.guard';

import { Permission } from '../permission/permission.entity';
import { PermissionLoader } from '../permission/permission.loader';
import { PermissionService } from '../permission/permission.service';

import { CreateUserDTO } from './dto/create.dto';
import { UpdateUserDTO } from './dto/update.dto';

// tslint:disable: no-unsafe-any
@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly permissionService: PermissionService) {}

  @Query('findUser')
  public async findUser(@Args('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Query('findUsers')
  public async findUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Mutation('createUser')
  public async createUser(@Args('data') createUserInput: CreateUserDTO): Promise<User> {
    return await this.userService.create(createUserInput);
  }

  @Mutation('updateUser')
  public async updateUser(@Args('id') id: string, @Args('data') updateUserInput: UpdateUserDTO): Promise<User> {
    return this.userService.update(id, updateUserInput);
  }

  @Mutation('deleteUser')
  public async deleteUser(@Args('id') id: string): Promise<User> {
    return await this.userService.delete(id);
  }

  @Mutation('addUserPermission')
  public async addUserPermission(@Args('userId') userId: string, @Args('permissionId') permissionId: number) {
    const user = await this.userService.findOne(userId, { relations: ['permissions'] });
    const permission = await this.permissionService.findOne(permissionId);

    user.permissions.push(permission);

    return await this.userService.save(user);
  }

  @ResolveProperty()
  @Loader(PermissionLoader)
  public async permissions(
    @Parent() user: User,
    @Context('PermissionLoader') permissionLoader: DataLoader<string, Permission[]>
  ) {
    return await permissionLoader.load(user.id);
  }
}
// tslint:enable: no-unsafe-any
