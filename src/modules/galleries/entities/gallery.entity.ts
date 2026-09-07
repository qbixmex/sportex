import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { formatPermalinkOrSlug } from '../../../utils/format_permalink.util.js';

@Entity({ name: 'galleries' })
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'title',
  })
  title!: string;

  @Column({
    type: 'varchar',
    name: 'permalink',
    unique: true,
  })
  permalink!: string;

  @Column({
    type: 'boolean',
    name: 'active',
    default: false,
  })
  active?: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt?: Date;

  @BeforeInsert()
  transformPermalinkInsert() {
    this.permalink = formatPermalinkOrSlug(this.permalink ?? this.title);
  }

  @BeforeUpdate()
  transformPermalinkUpdate() {
    this.permalink = formatPermalinkOrSlug(this.permalink ?? this.title);
  }
}
