import { ApiModelProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class UpdatePermissionDTO {
  @ApiModelProperty()
  @IsString()
  public readonly value: string;
}
