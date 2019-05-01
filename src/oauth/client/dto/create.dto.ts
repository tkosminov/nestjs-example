import { ApiModelProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

import { Field, InputType } from 'type-graphql';

@InputType('createClientInput')
export class CreateClientDTO {
  @Field()
  @ApiModelProperty()
  @IsString()
  @MinLength(4)
  public readonly title: string;
}
