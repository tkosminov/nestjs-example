import { Field, InputType } from 'type-graphql';

import { IsEmail, IsOptional } from 'class-validator';

@InputType('userUpdate')
export class UpdateUserDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  public readonly email: string;
}
