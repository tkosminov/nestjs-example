import { Field, InputType } from 'type-graphql';

import { IsOptional, IsString, MinLength } from 'class-validator';

@InputType('bookUpdate')
export class UpdateBookDTO {
  @Field()
  @IsOptional()
  @IsString()
  @MinLength(4)
  public readonly title: string;
}
