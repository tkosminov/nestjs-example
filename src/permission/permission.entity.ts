import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { Field, ID, ObjectType } from 'type-graphql';

import { IsInt, IsString } from 'class-validator';

import { EntityHelper } from '../common/helpers/module/entity.helper';

@ObjectType()
@Entity()
export class Permission extends EntityHelper {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @IsInt()
  public id: number;

  @Field()
  @Column()
  @Index({ unique: true })
  @IsString()
  public value: string;
}
