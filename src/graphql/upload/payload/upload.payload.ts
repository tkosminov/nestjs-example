import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadPayload {
  @Field()
  public url: string;
}
