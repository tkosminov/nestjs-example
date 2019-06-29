import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Field, ID, ObjectType } from 'type-graphql';

import { IsEmail, IsUUID, MinLength } from 'class-validator';

import { EntityHelper } from '../../common/helpers/module/entity.helper';

import { Permission } from '../permission/permission.entity';

@ObjectType()
@Entity()
export class User extends EntityHelper {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string;

  @Field()
  @Column()
  @Index({ unique: true })
  @IsEmail()
  public email: string;

  @Column()
  @MinLength(4)
  public password: string;

  @Field(() => [Permission], { nullable: true })
  @ManyToMany(() => Permission, { nullable: true })
  @JoinTable()
  public permissions?: Permission[];

  public jwtPayload() {
    return {
      id: this.id,
      email: this.email,
      permissions: (this.permissions || []).map(p => p.value),
    };
  }
}
