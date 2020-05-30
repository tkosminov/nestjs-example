import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IsString, IsUUID, MinLength } from 'class-validator';

import { generateToken } from '../../common/helpers';
import { EntityHelper } from '../../common/helpers/module/entity.helper';

import { User } from '../user/user.entity';

@Entity()
export class RefreshToken extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    nullable: false,
  })
  @Index({ unique: true })
  @IsString()
  @MinLength(64)
  public refreshToken: string;

  @Column({
    nullable: false,
    type: 'timestamp without time zone',
  })
  public refreshTokenExpiresAt: Date;

  @Index()
  @Column('uuid', { nullable: false })
  @IsUUID()
  public userId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @BeforeInsert()
  @BeforeUpdate()
  protected generateAllTokens() {
    this.refreshToken = generateToken();
    this.refreshTokenExpiresAt = new Date(new Date().setDate(new Date().getDate() + 7));
  }
}
