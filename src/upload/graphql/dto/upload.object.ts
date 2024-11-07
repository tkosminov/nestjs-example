import { Field, ObjectType } from 'nestjs-graphql-easy';

@ObjectType()
export class UploadDTO {
  @Field(() => String, { nullable: false })
  public url: string;
}
