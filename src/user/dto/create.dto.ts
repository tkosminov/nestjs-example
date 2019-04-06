import { ApiModelProperty } from '@nestjs/swagger';

import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiModelProperty()
  @IsEmail()
  public readonly email: string;

  @ApiModelProperty()
  @MinLength(7)
  public readonly password: string;
}
