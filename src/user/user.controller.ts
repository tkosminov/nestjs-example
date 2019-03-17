import { Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async index() {
    return await this.userService.findAll();
  }
}
