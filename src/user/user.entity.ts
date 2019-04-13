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

import { IsEmail, IsUUID, MinLength } from 'class-validator';

import { passwordToHash } from '../common/helpers/pswd.helper';

import { Permission } from '../permission/permission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string;

  @Column()
  @Index({ unique: true })
  @IsEmail()
  public email: string;

  @Column()
  @MinLength(7)
  public password: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;

  @ManyToMany(() => Permission, { nullable: true })
  @JoinTable()
  public permissions?: Permission[];

  @BeforeInsert()
  protected hashPassword() {
    this.password = passwordToHash(this.password);
  }
}
