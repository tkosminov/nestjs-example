import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsString } from 'class-validator';

import { User } from '../user/user.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Index({ unique: true })
  @IsString()
  public value: string;

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

  @ManyToMany(() => User, user => user.permissions)
  @JoinTable()
  public users: User[];
}
