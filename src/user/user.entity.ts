import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { IsEmail, MinLength } from 'class-validator';

import { passwordToHash } from '../common/helpers/pswd.helper';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  @Index({ unique: true })
  @IsEmail()
  public email: string;

  @Column()
  @MinLength(7)
  public password: string;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: string;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updatedAt: string;

  @BeforeInsert()
  protected hashPassword() {
    this.password = passwordToHash(this.password);
  }
}
