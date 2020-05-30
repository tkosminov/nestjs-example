import { Field, ID, ObjectType } from '@nestjs/graphql';

import { IsString, IsUUID, MinLength } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityHelper } from '../../common/helpers/module/entity.helper';

import { User } from '../../oauth/user/user.entity';

@ObjectType()
@Entity()
export class Book extends EntityHelper {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Field()
  @Column()
  @Index()
  @IsString()
  @MinLength(4)
  public title: string;

  @Field(() => ID)
  @Index()
  @Column('uuid', { nullable: false })
  @IsUUID()
  public userId: string;

  @Field(() => User)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  public user: User;
}
