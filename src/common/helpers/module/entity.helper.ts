import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EntityHelper {
  @Field()
  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;
}
