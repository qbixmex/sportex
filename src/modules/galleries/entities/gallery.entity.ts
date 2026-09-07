import type { Relation } from 'typeorm';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { formatPermalinkOrSlug } from '../../../utils/format_permalink.util.js';
import { GalleryImage } from '../../gallery-images/entities/gallery-image.entity.js';

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

  @OneToMany(() => GalleryImage, (galleryImage) => galleryImage.gallery)
  images?: Relation<GalleryImage[]>;

  @BeforeInsert()
  transformPermalinkInsert() {
    this.permalink = formatPermalinkOrSlug(this.permalink ?? this.title);
  }

  @BeforeUpdate()
  transformPermalinkUpdate() {
    this.permalink = formatPermalinkOrSlug(this.permalink ?? this.title);
  }
}
