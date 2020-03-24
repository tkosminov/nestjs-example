import { Field, InputType } from '@nestjs/graphql';

import { IsString, MinLength } from 'class-validator';

@InputType('bookCreate')
export class CreateBookDTO {
  @Field()
  @IsString()
  @MinLength(4)
  public readonly title: string;
}
