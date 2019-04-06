import { ApiModelProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class CreatePermissionDTO {
  @ApiModelProperty()
  @IsString()
  public readonly value: string;
}
