import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { RecoveryKey } from '../recovery-key/recovery-key.entity';

export interface IJwtPayload {
  id: string;
  login: string;
  is_blocked: boolean;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updated_at: Date;

  @Column({ nullable: false })
  @Index({ unique: true })
  public login: string;

  @Column({ nullable: false })
  public password: string;

  @Index()
  @Column({
    nullable: false,
    default: () => 'false',
  })
  public is_blocked: boolean;

  @OneToMany(() => RefreshToken, (refresh_token) => refresh_token.user)
  public refresh_tokens?: RefreshToken[];

  @OneToMany(() => RecoveryKey, (recovery_key) => recovery_key.user)
  public recovery_keys?: RecoveryKey[];

  @BeforeInsert()
  @BeforeUpdate()
  protected loginToLowerCase() {
    this.login = this.login.trim().toLowerCase();
  }

  public json_for_jwt(): IJwtPayload {
    return {
      id: this.id,
      login: this.login,
      is_blocked: this.is_blocked,
    };
  }
}
