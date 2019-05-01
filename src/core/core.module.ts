import { Module } from '@nestjs/common';

import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, PermissionModule],
  providers: [],
  exports: [UserModule, PermissionModule],
})
export class CoreModule {}
