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

@Entity({ name: 'announcements' })
export class Announcement {
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
    type: 'timestamptz',
    name: 'publishedAt',
    nullable: true,
  })
  publishedAt?: Date;

  @Column({
    type: 'varchar',
    name: 'imageUrl',
    nullable: true,
  })
  imageUrl?: string;

  @Column({
    type: 'varchar',
    name: 'imagePublicId',
    nullable: true,
  })
  imagePublicId?: string;

  @Column({
    type: 'text',
    name: 'description',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'text',
    name: 'content',
  })
  content!: string;

  @Column({
    type: 'boolean',
    name: 'active',
    default: false,
  })
  active!: boolean;

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