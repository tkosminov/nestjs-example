import { ID } from '@nestjs/graphql';
import { DateTimeISOResolver } from 'graphql-scalars';
import { Column, CreateDateColumn, Entity, Field, ObjectType, PrimaryGeneratedColumn, UpdateDateColumn } from 'nestjs-graphql-easy';
import { Index, OneToMany } from 'typeorm';

import { Section } from '../section/section.entity';

@ObjectType()
@Entity()
export class Book {
  @Field(() => ID, { filterable: true, sortable: true, nullable: false })
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Field(() => DateTimeISOResolver, { nullable: false })
  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    precision: 3,
  })
  public created_at: Date;

  @Field(() => DateTimeISOResolver, { nullable: false })
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    precision: 3,
  })
  public updated_at: Date;

  @Field(() => String, { nullable: false })
  @Column()
  public title: string;

  @Field(() => Boolean, { filterable: true, nullable: false })
  @Index()
  @Column('boolean', { nullable: false, default: () => 'false' })
  public is_private: boolean;

  @OneToMany(() => Section, (section) => section.book)
  public sections: Section[];
}
