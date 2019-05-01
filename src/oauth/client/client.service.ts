import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from './client.entity';

import { ServiceHelper } from '../../common/helpers/module/service.helper';

@Injectable()
export class ClientService extends ServiceHelper<Client> {
  constructor(
    @InjectRepository(Client)
    clientRepository: Repository<Client>
  ) {
    super(clientRepository);
  }
}
