import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

export class RefreshDTO {
  @ApiProperty()
  @IsString()
  @MinLength(64)
  public readonly refreshToken: string;
}
