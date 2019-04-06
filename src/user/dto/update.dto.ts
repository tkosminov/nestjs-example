import { ApiModelProperty } from '@nestjs/swagger';

import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @ApiModelProperty({ required: false })
  @IsEmail()
  @IsOptional()
  public readonly email: string;
}
