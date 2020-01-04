import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, MinLength } from 'class-validator';

export class PasswordDTO {
  @ApiProperty()
  @IsEmail()
  public readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  public readonly password: string;
}
