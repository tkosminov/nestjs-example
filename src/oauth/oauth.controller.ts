import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';

import { authorization_failed } from '../errors';
import { validateDTO } from '../helpers/validate.helper';

import { OAuthService } from './oauth.service';
import { SignInByPasswordDTO } from './dto/sign-in-by-password.dto';
import { SignInByRefreshTokenDTO } from './dto/sign-in-by-refresh-token.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { RegistrationDTO } from './dto/registration.dto';
import { SignInResponseDTO } from './dto/sign-in-response.dto';

@ApiTags('oauth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @ApiOperation({
    summary: 'User registration',
  })
  @ApiBody({
    type: RegistrationDTO,
    required: true,
  })
  @ApiOkResponse({
    isArray: true,
    type: String,
  })
  @Post('registration')
  public async registration(@Body() body: RegistrationDTO) {
    return await this.oauthService.registration(body.login, body.password);
  }

  @ApiOperation({
    summary: 'User authorization',
  })
  @ApiQuery({
    name: 'grand_type',
    description: 'Grand type',
    enum: ['password', 'refresh_token'],
    required: true,
  })
  @ApiQuery({
    name: 'username',
    description: 'User login. If grand_type = password',
    required: false,
  })
  @ApiQuery({
    name: 'password',
    description: 'User password. If grand_type = password',
    required: false,
  })
  @ApiQuery({
    name: 'refresh_token',
    description: 'Refresh token. If grand_type = refresh_token',
    required: false,
  })
  @ApiOkResponse({
    type: SignInResponseDTO,
    isArray: false,
  })
  @Post('token')
  public async token(@Req() req: Request) {
    if (Object.keys(req.query).length) {
      switch (req.query.grand_type) {
        case 'password':
          const sign_in_by_password_dto = {
            login: req.query.username as string,
            password: req.query.password as string,
          };

          validateDTO(SignInByPasswordDTO, sign_in_by_password_dto);

          return await this.oauthService.signInByPassword(sign_in_by_password_dto.login, sign_in_by_password_dto.password);
        case 'refresh_token':
          const sign_in_by_refresh_token_dto = {
            refresh_token: req.query.refresh_token as string,
          };

          validateDTO(SignInByRefreshTokenDTO, sign_in_by_refresh_token_dto);

          return await this.oauthService.signInByRefreshToken(sign_in_by_refresh_token_dto.refresh_token);
      }
    }

    authorization_failed({ raise: true });
  }

  @ApiOperation({
    summary: 'Password recovery',
  })
  @ApiBody({
    type: ChangePasswordDTO,
    required: true,
  })
  @Post('change_password')
  public async changePassword(@Body() body: ChangePasswordDTO) {
    return await this.oauthService.changePassword(body.recovery_key, body.new_password);
  }
}
