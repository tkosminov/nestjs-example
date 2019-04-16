import { ApiModelProperty } from '@nestjs/swagger';

import { Field, InputType } from 'type-graphql';

import { IsEmail, IsOptional } from 'class-validator';

@InputType('updateUserInput')
export class UpdateUserDTO {
  @Field({ nullable: true })
  @ApiModelProperty({ required: false })
  @IsEmail()
  @IsOptional()
  public readonly email: string;
}
