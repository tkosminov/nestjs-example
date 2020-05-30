import { Args, Context, ID, Int, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import DataLoader from 'dataloader';

import { access_denied } from '../../common/errors';

import { Book } from './book.entity';
import { BookService } from './book.service';

import { CreateBookDTO } from './dto/create.dto';
import { UpdateBookDTO } from './dto/update.dto';

import { User } from '../../oauth/user/user.entity';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => [Book])
  public async books(
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args({ name: 'per_page', type: () => Int }) take: number
  ) {
    if (take < 1) {
      take = 10;
    }
    if (page < 0) {
      page = 0;
    }

    return await this.bookService.findAll({ take, skip: take * page });
  }

  @Query(() => Book)
  public async book(@Args({ name: 'id', type: () => ID }) id: string) {
    return await this.bookService.findOne(id);
  }

  @Mutation(() => Book)
  public async bookCreate(@Args('data') data: CreateBookDTO, @Context('user') user: User) {
    return await this.bookService.create({ ...data, userId: user.id });
  }

  @Mutation(() => Book)
  public async bookUpdate(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('data') data: UpdateBookDTO,
    @Context('user') user: User
  ) {
    const book = await this.bookService.findOne(id);

    if (book.userId !== user.id) {
      access_denied({ raise: true });
    }

    return await this.bookService.update(id, data);
  }

  @Mutation(() => Book)
  public async bookDelete(@Args({ name: 'id', type: () => ID }) id: string, @Context('user') user: User) {
    const book = await this.bookService.findOne(id);

    if (book.userId !== user.id) {
      access_denied({ raise: true });
    }

    return await this.bookService.delete(id);
  }

  @ResolveProperty()
  public async user(@Parent() book: Book, @Context('UserLoaderById') loader: DataLoader<string, User>) {
    return await loader.load(book.userId);
  }
}
