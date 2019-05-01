import { ApiModelProperty } from '@nestjs/swagger';

import { Field, ID, InputType } from 'type-graphql';

import { IsEmail, IsOptional, IsUUID, MinLength } from 'class-validator';

@InputType('createUserInput')
export class CreateUserDTO {
  @Field(() => ID, { nullable: true })
  @ApiModelProperty({ required: false })
  @IsOptional()
  @IsUUID()
  public readonly id: string;

  @Field()
  @ApiModelProperty()
  @IsEmail()
  public readonly email: string;

  @Field()
  @ApiModelProperty()
  @MinLength(7)
  public readonly password: string;
}
