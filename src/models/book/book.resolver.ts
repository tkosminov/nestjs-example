import { Inject } from '@nestjs/common';
import { Args, Context, GraphQLExecutionContext, Parent, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ELoaderType, Filter, Loader, Mutation, Order, Pagination, Query, ResolveField } from 'nestjs-graphql-easy';

import { GRAPHQL_SUBSCRIPTION } from '../../graphql/graphql.module';
import { Section } from '../section/section.entity';
import { Book } from './book.entity';
import { BookService } from './book.service';
import { BookCreateDTO } from './mutation-input/create.dto';

@Resolver(() => Book)
export class BookResolver {
  constructor(
    private readonly book_service: BookService,
    @Inject(GRAPHQL_SUBSCRIPTION) private readonly subscription: RedisPubSub
  ) {}

  @Query(() => [Book])
  public async books(
    @Loader({
      loader_type: ELoaderType.MANY,
      field_name: 'books',
      entity: () => Book,
      entity_fk_key: 'id',
    })
    field_alias: string,
    @Filter(() => Book) _filter: unknown,
    @Order(() => Book) _order: unknown,
    @Pagination() _pagination: unknown,
    @Context() ctx: GraphQLExecutionContext
  ) {
    return await ctx[field_alias];
  }

  @ResolveField(() => [Section], { nullable: true })
  public async sections(
    @Parent() book: Book,
    @Loader({
      loader_type: ELoaderType.ONE_TO_MANY,
      field_name: 'sections',
      entity: () => Section,
      entity_fk_key: 'book_id',
    })
    field_alias: string,
    @Filter(() => Section) _filter: unknown,
    @Order(() => Section) _order: unknown,
    @Context() ctx: GraphQLExecutionContext
  ): Promise<Section[]> {
    return await ctx[field_alias].load(book.id);
  }

  @Mutation(() => Book)
  protected async bookCreate(@Args('data') data: BookCreateDTO) {
    const book = await this.book_service.create(data);

    this.subscription.publish('bookCreateEvent', { bookCreateEvent: book });

    return book;
  }

  @Subscription(() => Book)
  protected async bookCreateEvent() {
    return this.subscription.asyncIterableIterator('bookCreateEvent');
  }
}
