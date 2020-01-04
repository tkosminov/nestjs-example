import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

export class AuthorizationDTO {
  @ApiProperty()
  @IsString()
  @MinLength(64)
  public readonly authorizationCode: string;
}
