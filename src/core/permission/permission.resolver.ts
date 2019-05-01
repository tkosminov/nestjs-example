import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ID } from 'type-graphql';

import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';

import { CreatePermissionDTO } from './dto/create.dto';
import { UpdatePermissionDTO } from './dto/update.dto';

// tslint:disable: no-unsafe-any
@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Query(() => Permission)
  public async permission(@Args({ name: 'id', type: () => ID }) id: number) {
    return await this.permissionService.findOne(id);
  }

  @Query(() => [Permission])
  public async permissions(): Promise<Permission[]> {
    return await this.permissionService.findAll();
  }

  @Mutation(() => Permission)
  public async permissionCreate(@Args('data') createPermissionInput: CreatePermissionDTO) {
    return await this.permissionService.create(createPermissionInput);
  }

  @Mutation(() => Permission)
  public async permissionUpdate(
    @Args({ name: 'id', type: () => ID }) id: number,
    @Args('data') updatePermissionInput: UpdatePermissionDTO
  ) {
    return await this.permissionService.update(id, updatePermissionInput);
  }

  @Mutation(() => Permission)
  public async permissionDelete(@Args({ name: 'id', type: () => ID }) id: number) {
    return await this.permissionService.delete(id);
  }
}
// tslint:enable: no-unsafe-any
