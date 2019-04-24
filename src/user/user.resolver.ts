import { Args, Context, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import { ID } from 'type-graphql';

import DataLoader from 'dataloader';
import { Loader } from '../common/loader/loader.decorator';

import { User } from './user.entity';
import { UserService } from './user.service';

import { Permission } from '../permission/permission.entity';
import { PermissionLoader } from '../permission/permission.loader';
import { PermissionService } from '../permission/permission.service';

import { CreateUserDTO } from './dto/create.dto';
import { UpdateUserDTO } from './dto/update.dto';

// tslint:disable: no-unsafe-any
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly permissionService: PermissionService) {}

  @Query(() => User)
  public async findUser(@Args({ name: 'id', type: () => ID }) id: string) {
    return await this.userService.findOne(id);
  }

  @Query(() => [User])
  public async findUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Mutation(() => User)
  public async createUser(@Args('data') createUserInput: CreateUserDTO) {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  public async updateUser(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('data') updateUserInput: UpdateUserDTO
  ) {
    return await this.userService.update(id, updateUserInput, { relations: ['permissions'] });
  }

  @Mutation(() => User)
  public async deleteUser(@Args({ name: 'id', type: () => ID }) id: string) {
    return await this.userService.delete(id, { relations: ['permissions'] });
  }

  @Mutation(() => User)
  public async addUserPermission(
    @Args({ name: 'userId', type: () => ID }) userId: string,
    @Args({ name: 'permissionId', type: () => ID }) permissionId: number
  ) {
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
