import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from './permission.entity';

import { ServiceHelper } from '../../common/helpers/module/service.helper';

@Injectable()
export class PermissionService extends ServiceHelper<Permission> {
  constructor(
    @InjectRepository(Permission)
    permissionRepository: Repository<Permission>
  ) {
    super(permissionRepository);
  }
}
