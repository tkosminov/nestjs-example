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
  public async findPermission(@Args({ name: 'id', type: () => ID }) id: number): Promise<Permission> {
    return await this.permissionService.findOne(id);
  }

  @Query(() => [Permission])
  public async findPermissions(): Promise<Permission[]> {
    return await this.permissionService.findAll();
  }

  @Mutation(() => Permission)
  public async createPermission(@Args('data') createPermissionInput: CreatePermissionDTO): Promise<Permission> {
    return await this.permissionService.create(createPermissionInput);
  }

  @Mutation(() => Permission)
  public async updatePermission(
    @Args({ name: 'id', type: () => ID }) id: number,
    @Args('data') updatePermissionInput: UpdatePermissionDTO
  ): Promise<Permission> {
    return this.permissionService.update(id, updatePermissionInput);
  }

  @Mutation(() => Permission)
  public async deletePermission(@Args({ name: 'id', type: () => ID }) id: number): Promise<Permission> {
    return await this.permissionService.delete(id);
  }
}
// tslint:enable: no-unsafe-any
