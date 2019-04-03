import { ApiModelProperty } from '@nestjs/swagger';

import { IsEmail, IsOptional } from 'class-validator';

import { User } from '../user.entity';

export class PossUserDTO implements Poss<User, 'id' | 'createdAt' | 'updatedAt' | 'password'> {
  @ApiModelProperty({
    required: false,
  })
  @IsEmail()
  @IsOptional()
  public readonly email: string;
}
