import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ID } from 'type-graphql';

import { Client } from './client.entity';
import { ClientService } from './client.service';

import { CreateClientDTO } from './dto/create.dto';
import { UpdateClientDTO } from './dto/update.dto';

// tslint:disable: no-unsafe-any
@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Query(() => Client)
  public async client(@Args({ name: 'id', type: () => ID }) id: number) {
    return await this.clientService.findOne(id);
  }

  @Query(() => [Client])
  public async clients(): Promise<Client[]> {
    return await this.clientService.findAll();
  }

  @Mutation(() => Client)
  public async clientCreate(@Args('data') data: CreateClientDTO) {
    return await this.clientService.create(data);
  }

  @Mutation(() => Client)
  public async clientUpdate(@Args({ name: 'id', type: () => ID }) id: number, @Args('data') data: UpdateClientDTO) {
    return await this.clientService.update(id, data);
  }

  @Mutation(() => Client)
  public async clientDelete(@Args({ name: 'id', type: () => ID }) id: number) {
    return await this.clientService.delete(id);
  }
}
// tslint:enable: no-unsafe-any
