import { ApiModelProperty } from '@nestjs/swagger';

import { Field, InputType } from 'type-graphql';

import { IsString } from 'class-validator';

@InputType('updatePermissionInput')
export class UpdatePermissionDTO {
  @Field()
  @ApiModelProperty()
  @IsString()
  public readonly value: string;
}
