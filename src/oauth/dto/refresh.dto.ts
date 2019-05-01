import { ApiModelProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

export class RefreshDTO {
  @ApiModelProperty()
  @IsString()
  @MinLength(16)
  public readonly refreshToken: string;
}
