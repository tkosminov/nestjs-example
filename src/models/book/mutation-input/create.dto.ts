import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class BookCreateDTO {
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  public title: string;
}
