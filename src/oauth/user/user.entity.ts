import { Field, ID, ObjectType } from '@nestjs/graphql';

import { IsBoolean, IsEmail, IsEmpty, IsString, MinLength } from 'class-validator';
import { BeforeInsert, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { EntityHelper } from '../../common/helpers/module/entity.helper';
import { passwordToHash } from '../../common/helpers/password.helper';

import { Book } from '../../core/book/book.entity';
import { RefreshToken } from '../refresh_token/refresh_token.entity';

@ObjectType()
@Entity()
export class User extends EntityHelper {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    nullable: false,
    default: () => 'MD5(random()::text)',
  })
  @Index({ unique: true })
  @IsString()
  @MinLength(32)
  public authorizationCode: string;

  @Field()
  @Column()
  @Index({ unique: true })
  @IsEmail()
  public email: string;

  @Field()
  @Column('boolean', { default: () => 'false' })
  @IsBoolean()
  public isAdmin: boolean;

  @Column()
  @IsEmpty()
  public password: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, { onDelete: 'CASCADE' })
  public refreshTokens: RefreshToken[];

  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (book) => book.user, { onDelete: 'CASCADE' })
  public books: Book[];

  @BeforeInsert()
  protected hashedPassword() {
    this.password = passwordToHash(this.password);
  }

  public jwtPayload() {
    return {
      id: this.id,
      email: this.email,
      isAdmin: this.isAdmin,
    };
  }
}
