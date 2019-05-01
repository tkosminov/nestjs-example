import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ServiceHelper } from '../../common/helpers/module/service.helper';

import { Auth } from './auth.entity';

@Injectable()
export class AuthService extends ServiceHelper<Auth> {
  constructor(@InjectRepository(Auth) authRepository: Repository<Auth>) {
    super(authRepository);
  }
}
