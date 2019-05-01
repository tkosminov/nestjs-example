import { ApiModelProperty } from '@nestjs/swagger';

import { Field, InputType } from 'type-graphql';

import { IsString } from 'class-validator';

@InputType('createPermissionInput')
export class CreatePermissionDTO {
  @Field()
  @ApiModelProperty()
  @IsString()
  public readonly value: string;
}
