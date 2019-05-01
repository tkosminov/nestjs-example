import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerService } from '../../common/logger/logger.service';

import { User } from './user.entity';
import { UserLoader } from './user.loader';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [forwardRef(() => PermissionModule), TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UserResolver,
    UserLoader,
    {
      provide: LoggerService,
      useValue: new LoggerService('UserController'),
    },
  ],
  exports: [UserService, UserLoader],
})
export class UserModule {}
