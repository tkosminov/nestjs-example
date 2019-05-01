import { ApiModelProperty } from '@nestjs/swagger';

import { IsString, IsUUID } from 'class-validator';

export class ClientDTO {
  @ApiModelProperty()
  @IsUUID()
  public readonly id: string;

  @ApiModelProperty()
  @IsString()
  public readonly secret: string;
}
