import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Field, ID, ObjectType } from 'type-graphql';

import { IsEmail, IsUUID, MinLength } from 'class-validator';

import { passwordToHash } from '../common/helpers/pswd.helper';

import { Permission } from '../permission/permission.entity';

@ObjectType()
@Entity()
export class User {
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
  @MinLength(7)
  public password: string;

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

  @Field(() => [Permission], { nullable: true })
  @ManyToMany(() => Permission, { nullable: true })
  @JoinTable()
  public permissions?: Permission[];

  @BeforeInsert()
  protected hashPassword() {
    this.password = passwordToHash(this.password);
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      permissions: this.permissions.map(p => p.value),
    };
  }
}
