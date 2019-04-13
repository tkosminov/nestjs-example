import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { IsInt, IsString } from 'class-validator';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  @IsInt()
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
}
