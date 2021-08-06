import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ServiceHelper } from '../../common/helpers/module/service.helper';

import { RefreshToken } from './refresh_token.entity';

@Injectable()
export class RefreshTokenService extends ServiceHelper<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    refreshTokenRepository: Repository<RefreshToken>,
  ) {
    super(refreshTokenRepository);
  }
}
