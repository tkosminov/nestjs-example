import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginUserDTO } from '../user/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_in')
  public async signIn(@Body() credentials: LoginUserDTO) {
    return await this.authService.createToken(credentials);
  }

  @Post('rigistration')
  public async rigistration(@Body() credentials: LoginUserDTO) {
    return await this.authService.rigistration(credentials);
  }
}
