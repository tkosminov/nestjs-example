import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UploadPayload {
  @Field()
  public url: string;
}
