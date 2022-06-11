import { ID } from '@nestjs/graphql';

import { Index, OneToMany } from 'typeorm';
import { Field, ObjectType, Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'nestjs-graphql-easy';

import { Section } from '../section/section.entity';

@ObjectType()
@Entity()
export class Book {
  @Field(() => ID, { filterable: true, sortable: true })
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updated_at: Date;

  @Field(() => String)
  @Column()
  public title: string;

  @Index()
  @Field(() => Boolean, { filterable: true })
  @Column('boolean', { nullable: false, default: () => 'false' })
  public is_private: boolean;

  @Field(() => ID, { filterable: true, sortable: true })
  @Index()
  @Column('uuid', { nullable: false })
  public author_id: string;

  @OneToMany(() => Section, (section) => section.book, { onDelete: 'CASCADE' })
  public sections: Section[];
}
