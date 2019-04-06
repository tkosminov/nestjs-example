import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerService } from '../common/logger/logger.service';

import { Permission } from './permission.entity';
import { PermissionLoader } from './permission.loader';
import { PermissionResolver } from './permission.resolver';
import { PermissionService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [
    PermissionService,
    PermissionResolver,
    PermissionLoader,
    {
      provide: LoggerService,
      useValue: new LoggerService('PermissionController'),
    },
  ],
  exports: [PermissionService, PermissionLoader],
})
export class PermissionModule {}
