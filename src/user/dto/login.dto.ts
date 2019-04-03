import { ApiModelProperty } from '@nestjs/swagger';

import { IsEmail, MinLength } from 'class-validator';

import { User } from '../user.entity';

export class LoginUserDTO implements Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  @ApiModelProperty()
  @IsEmail()
  public readonly email: string;

  @ApiModelProperty()
  @MinLength(7)
  public readonly password: string;
}
