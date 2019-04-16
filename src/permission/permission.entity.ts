import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Field, ID, ObjectType } from 'type-graphql';

import { IsInt, IsString } from 'class-validator';

@ObjectType()
@Entity()
export class Permission {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @IsInt()
  public id: number;

  @Field()
  @Column()
  @Index({ unique: true })
  @IsString()
  public value: string;

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
