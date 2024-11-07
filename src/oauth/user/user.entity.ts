import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { RecoveryKey } from '../recovery-key/recovery-key.entity';
import { RefreshToken } from '../refresh-token/refresh-token.entity';

export interface IJwtPayload {
  id: string;
  username: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updated_at: Date;

  @Column({ nullable: false })
  @Index('IDX_78a916df40e02a9deb1c4b75ed', { synchronize: false })
  public username: string;

  @Column({ nullable: false })
  public encrypted_password: string;

  @OneToMany(() => RefreshToken, (refresh_token) => refresh_token.user)
  public refresh_tokens?: RefreshToken[];

  @OneToMany(() => RecoveryKey, (recovery_key) => recovery_key.user)
  public recovery_keys?: RecoveryKey[];

  public getJwtPayload(): IJwtPayload {
    return {
      id: this.id,
      username: this.username,
    };
  }
}
