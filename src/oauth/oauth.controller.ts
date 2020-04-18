import { Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';

import { throwBADREQUEST } from '../common/errors';

import { OAuthService } from './oauth.service';

@ApiTags('oauth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @ApiOperation({
    summary: 'Sign in',
  })
  @ApiQuery({ name: 'grand_type', enum: ['password', 'refresh_token', 'authorization_code'] })
  @ApiQuery({
    name: 'username',
    description: 'Email. If grand_type = password',
    required: false,
  })
  @ApiQuery({
    name: 'password',
    description: 'If grand_type = password',
    required: false,
  })
  @ApiQuery({
    name: 'code',
    description: 'If grand_type = authorization_code',
    required: false,
  })
  @ApiQuery({
    name: 'refresh_token',
    description: 'If grand_type = refresh_token',
    required: false,
  })
  @Post('token')
  public async token(@Req() req: Request) {
    if (Object.keys(req.query).length) {
      switch (req.query.grand_type) {
        case 'password':
          return await this.oauthService.signInByPassword({
            email: req.query.username as string,
            password: req.query.password as string,
          });
        case 'refresh_token':
          return await this.oauthService.signInByRefreshToken({
            refreshToken: req.query.refresh_token as string,
          });
        case 'authorization_code':
          return await this.oauthService.signInByAuthorizationCode({
            authorizationCode: req.query.code as string,
          });
      }
    }

    throwBADREQUEST();
  }
}
