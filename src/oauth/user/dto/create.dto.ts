import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, Length } from 'class-validator';

@InputType('userCreate')
export class CreateUserDTO {
  @Field()
  @IsEmail()
  public readonly email: string;

  @Field()
  @Length(4, 32)
  public readonly password: string;
}
