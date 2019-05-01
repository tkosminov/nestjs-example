import { ApiModelProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

import { Field, InputType } from 'type-graphql';

@InputType('updateClientInput')
export class UpdateClientDTO {
  @Field()
  @ApiModelProperty()
  @IsString()
  @MinLength(4)
  public readonly title: string;
}
