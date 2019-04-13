import { ApiModelProperty } from '@nestjs/swagger';

import { IsEmail, IsOptional, IsUUID, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiModelProperty({ required: false })
  @IsOptional()
  @IsUUID()
  public readonly id: string;

  @ApiModelProperty()
  @IsEmail()
  public readonly email: string;

  @ApiModelProperty()
  @MinLength(7)
  public readonly password: string;
}
