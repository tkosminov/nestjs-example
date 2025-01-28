import { Inject } from '@nestjs/common';
import { Args, Context, GraphQLExecutionContext, ID, Parent, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ELoaderType, Filter, Loader, Mutation, Order, Pagination, Query, ResolveField } from 'nestjs-graphql-easy';

import { GRAPHQL_SUBSCRIPTION } from '../../graphql/graphql.module';
import { Book } from '../book/book.entity';
import { SectionCreateDTO } from './mutation-input/create.dto';
import { Section } from './section.entity';
import { SectionService } from './section.service';

@Resolver(() => Section)
export class SectionResolver {
  constructor(
    private readonly section_service: SectionService,
    @Inject(GRAPHQL_SUBSCRIPTION) private readonly subscription: RedisPubSub
  ) {}

  @Query(() => [Section])
  public async sections(
    @Loader({
      loader_type: ELoaderType.MANY,
      field_name: 'sections',
      entity: () => Section,
      entity_fk_key: 'id',
    })
    field_alias: string,
    @Filter(() => Section) _filter: unknown,
    @Order(() => Section) _order: unknown,
    @Pagination() _pagination: unknown,
    @Context() ctx: GraphQLExecutionContext
  ) {
    return await ctx[field_alias];
  }

  @ResolveField(() => Book, { nullable: false })
  public async book(
    @Parent() section: Section,
    @Loader({
      loader_type: ELoaderType.MANY_TO_ONE,
      field_name: 'book',
      entity: () => Book,
      entity_fk_key: 'id',
    })
    field_alias: string,
    @Context() ctx: GraphQLExecutionContext
  ): Promise<Book> {
    return await ctx[field_alias].load(section.book_id);
  }

  @Mutation(() => Section)
  protected async sectionCreate(@Args('data') data: SectionCreateDTO) {
    const section = await this.section_service.create(data);

    this.subscription.publish('sectionCreateEvent', { sectionCreateEvent: section, channel_ids: [section.book_id] });

    return section;
  }

  @Subscription(() => Section, {
    filter: (payload, variables) => payload.channel_ids.includes(variables.channel_id),
  })
  protected async sectionCreateEvent(@Args({ name: 'channel_id', type: () => ID, nullable: false }) _channel_id: string) {
    return this.subscription.asyncIterableIterator('sectionCreateEvent');
  }
}
