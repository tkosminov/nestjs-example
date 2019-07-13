import { IsBoolean } from 'class-validator';

import { Field, InputType } from 'type-graphql';

@InputType('uploadInput')
export class UploadDTO {
  @Field()
  @IsBoolean()
  public readonly modifyNeed: boolean;
}
