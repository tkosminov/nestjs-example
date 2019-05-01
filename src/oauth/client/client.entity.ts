import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Field, ID, ObjectType } from 'type-graphql';

import { IsString, MinLength } from 'class-validator';

import { EntityHelper } from '../../common/helpers/module/entity.helper';

import { Auth } from '../auth/auth.entity';

@ObjectType()
@Entity()
export class Client extends EntityHelper {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Field(() => ID)
  @Column({
    nullable: false,
    default: () => 'MD5(random()::text)',
  })
  @Index({ unique: true })
  public secret: string;

  @Field()
  @Column()
  @Index({ unique: true })
  @IsString()
  @MinLength(1)
  public title: string;

  @OneToMany(() => Auth, auth => auth.client)
  public auths: Auth[];
}
