import { Controller, HttpException, Post, Req } from '@nestjs/common';
import { ApiImplicitQuery, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { Request } from 'express';

import { OAuthService } from './oauth.service';

import { ClientDTO } from './dto/client.dto';

@ApiUseTags('auth')
@Controller('auth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  // tslint:disable: no-feature-envy
  // tslint:disable: no-unsafe-any
  @ApiOperation({
    title: 'Sign in',
    description: 'Get JWT token',
  })
  @ApiImplicitQuery({ name: 'grand_type', enum: ['password', 'refresh_token', 'authorization_code'] })
  @ApiImplicitQuery({
    name: 'username',
    description: 'Email. If grand_type = password',
    required: false,
  })
  @ApiImplicitQuery({
    name: 'password',
    description: 'If grand_type = password',
    required: false,
  })
  @ApiImplicitQuery({
    name: 'code',
    description: 'If grand_type = authorization_code',
    required: false,
  })
  @ApiImplicitQuery({
    name: 'refresh_token',
    description: 'If grand_type = refresh_token',
    required: false,
  })
  @ApiImplicitQuery({ name: 'client_id', description: 'client id' })
  @ApiImplicitQuery({ name: 'client_secret', description: 'client secret' })
  @Post('token')
  public async token(@Req() req: Request) {
    if (Object.keys(req.query).length) {
      const clientCredentials: ClientDTO = {
        id: req.query.client_id,
        secret: req.query.client_secret,
      };

      switch (req.query.grand_type) {
        case 'password':
          return await this.oauthService.signInByPassword(
            {
              email: req.query.username,
              password: req.query.password,
            },
            clientCredentials
          );
        case 'refresh_token':
          return await this.oauthService.signInByRefreshToken(
            {
              refreshToken: req.query.refresh_token,
            },
            clientCredentials
          );
        case 'authorization_code':
          return await this.oauthService.signInByAuthorizationCode(
            {
              authorizationCode: req.query.code,
            },
            clientCredentials
          );
      }
    }

    throw new HttpException('Bad request', 400);
  }
  // tslint:enable: no-feature-envy
  // tslint:enable: no-unsafe-any
}
