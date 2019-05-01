import { Body, Controller, Post } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { CreateUserDTO } from '../core/user/dto/create.dto';
import { LoginUserDTO } from '../core/user/dto/login.dto';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_in')
  public async signIn(@Body() credentials: LoginUserDTO) {
    return await this.authService.createToken(credentials);
  }

  @Post('rigistration')
  public async rigistration(@Body() credentials: CreateUserDTO) {
    return await this.authService.rigistration(credentials);
  }
}
