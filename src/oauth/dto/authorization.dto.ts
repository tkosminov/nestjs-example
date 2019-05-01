import { ApiModelProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

export class AuthorizationDTO {
  @ApiModelProperty()
  @IsString()
  @MinLength(16)
  public readonly authorizationCode: string;
}
