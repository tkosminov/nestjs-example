import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import DataLoader from 'dataloader';

import { User } from './user.entity';
import { UserService } from './user.service';

import { Book } from '../../core/book/book.entity';

import { CreateUserDTO } from './dto/create.dto';
import { UpdateUserDTO } from './dto/update.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  public async users(
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args({ name: 'per_page', type: () => Int }) take: number,
  ) {
    if (take < 1) {
      take = 10;
    }
    if (page < 0) {
      page = 0;
    }

    return await this.userService.findAll({ take, skip: take * page });
  }

  @Query(() => User)
  public async user(@Args({ name: 'id', type: () => ID }) id: string) {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User)
  public async userCreate(@Args('data') data: CreateUserDTO) {
    return await this.userService.create(data);
  }

  @Mutation(() => User)
  public async userUpdate(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('data') data: UpdateUserDTO,
  ) {
    return await this.userService.update(id, data);
  }

  @ResolveField()
  public async books(
    @Parent() user: User,
    @Context('BookLoaderByUserId') loader: DataLoader<string, Book[]>,
  ) {
    return await loader.load(user.id);
  }
}
