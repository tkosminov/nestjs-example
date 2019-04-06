// import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Permission } from './permission.entity';
// import { PermissionGuard } from './permission.guard';
import { PermissionService } from './permission.service';

import { CreatePermissionDTO } from './dto/create.dto';
import { UpdatePermissionDTO } from './dto/update.dto';

// tslint:disable: no-unsafe-any
@Resolver('Permission')
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Query('findPermission')
  public async findPermission(@Args('id') id: number): Promise<Permission> {
    return await this.permissionService.findOne(id);
  }

  @Query('findPermissions')
  public async findPermissions(): Promise<Permission[]> {
    return await this.permissionService.findAll();
  }

  @Mutation('createPermission')
  public async createPermission(@Args('data') createPermissionInput: CreatePermissionDTO): Promise<Permission> {
    return await this.permissionService.create(createPermissionInput);
  }

  @Mutation('updatePermission')
  public async updatePermission(
    @Args('id') id: number,
    @Args('data') updatePermissionInput: UpdatePermissionDTO
  ): Promise<Permission> {
    return this.permissionService.update(id, updatePermissionInput);
  }

  @Mutation('deletePermission')
  public async deletePermission(@Args('id') id: number): Promise<Permission> {
    return await this.permissionService.delete(id);
  }
}
// tslint:enable: no-unsafe-any
