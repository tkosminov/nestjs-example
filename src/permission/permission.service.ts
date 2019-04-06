import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from './permission.entity';

import { CreatePermissionDTO } from './dto/create.dto';
import { UpdatePermissionDTO } from './dto/update.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}

  public async findAll() {
    return await this.permissionRepository.find();
  }

  public async findOne(id: number) {
    return await this.permissionRepository.findOne(id);
  }

  public async findByIds(ids: number[]) {
    return await this.permissionRepository.findByIds(ids);
  }

  public async create(permission: CreatePermissionDTO) {
    const model = await this.permissionRepository.create(permission);
    return await this.permissionRepository.save(model);
  }

  public async update(id: number, permission: UpdatePermissionDTO) {
    const model = await this.permissionRepository.findOne(id);
    return await this.permissionRepository.save(Object.assign(model, permission));
  }

  public async delete(id: number) {
    const model = await this.permissionRepository.findOne(id);
    await this.permissionRepository.delete(model.id);
    return model;
  }
}
