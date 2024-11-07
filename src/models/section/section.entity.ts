import { ID } from '@nestjs/graphql';
import { DateTimeISOResolver } from 'graphql-scalars';
import { Column, CreateDateColumn, Entity, Field, ObjectType, PrimaryGeneratedColumn, UpdateDateColumn } from 'nestjs-graphql-easy';
import { Index, JoinColumn, ManyToOne } from 'typeorm';

import { Book } from '../book/book.entity';

@ObjectType()
@Entity()
export class Section {
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

  @Field(() => ID, { filterable: true, sortable: true, nullable: false })
  @Index()
  @Column('uuid', { nullable: false })
  public book_id: string;

  @ManyToOne(() => Book, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  public book: Book;
}
