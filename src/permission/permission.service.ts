import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from './permission.entity';

import { CreatePermissionDTO } from './dto/create.dto';
import { UpdatePermissionDTO } from './dto/update.dto';

import { RepositoryHelper } from '../common/helpers/repository.helper';

@Injectable()
export class PermissionService extends RepositoryHelper<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {
    super(permissionRepository);
  }

  public async create(permission: CreatePermissionDTO) {
    const model = await this.permissionRepository.create(permission);
    return await this.permissionRepository.save(model);
  }

  public async update(id: number, permission: UpdatePermissionDTO) {
    const model = await this.permissionRepository.findOne(id);
    return await this.permissionRepository.save(Object.assign(model, permission));
  }

  public async save(permission: Permission) {
    return await this.permissionRepository.save(permission);
  }
}
