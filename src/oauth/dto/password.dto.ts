import { ApiModelProperty } from '@nestjs/swagger';

import { IsEmail, IsString, MinLength } from 'class-validator';

export class PasswordDTO {
  @ApiModelProperty()
  @IsEmail()
  public readonly email: string;

  @ApiModelProperty()
  @IsString()
  @MinLength(4)
  public readonly password: string;
}
