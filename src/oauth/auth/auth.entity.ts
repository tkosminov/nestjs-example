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

import { IsString, MinLength } from 'class-validator';

import { EntityHelper } from '../../common/helpers/module/entity.helper';
import { generateToken } from '../../common/helpers/token.helper';

import { User } from '../../core/user/user.entity';
import { Client } from '../client/client.entity';

@Entity()
@Index('unique_auth_on_userId_and_cliendId', ['client', 'user'], { unique: true })
export class Auth extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    nullable: false,
  })
  @Index({ unique: true })
  @IsString()
  @MinLength(16)
  public authorizationCode: string;

  @Column({
    nullable: false,
  })
  @Index({ unique: true })
  @IsString()
  @MinLength(16)
  public refreshToken: string;

  @Column({
    nullable: false,
    type: 'timestamp without time zone',
  })
  public refreshTokenExpiresAt: Date;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn()
  public client: Client;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  public user: User;

  @BeforeInsert()
  protected createTokens() {
    this.authorizationCode = generateToken();

    this.refreshToken = generateToken();
    this.refreshTokenExpiresAt = new Date(new Date().setDate(new Date().getDate() + 7));
  }

  @BeforeUpdate()
  protected updateTokens() {
    this.refreshToken = generateToken();
    this.refreshTokenExpiresAt = new Date(new Date().setDate(new Date().getDate() + 7));
  }
}
