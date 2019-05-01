import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerService } from '../../common/logger/logger.service';

import { Client } from './client.entity';
import { ClientService } from './client.service';
import { ClientResolver } from './clint.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [
    ClientService,
    ClientResolver,
    {
      provide: LoggerService,
      useValue: new LoggerService('ClientController'),
    },
  ],
  exports: [ClientService],
})
export class ClientModule {}
