import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class SectionCreateDTO {
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @Field(() => ID, { nullable: false })
  @IsUUID()
  public book_id: string;
}
