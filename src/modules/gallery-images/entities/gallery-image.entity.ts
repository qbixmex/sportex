import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gallery } from '../../galleries/entities/gallery.entity.js';

@Entity({ name: 'gallery_images' })
export class GalleryImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Gallery, (gallery) => gallery.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gallery_id' })
  gallery!: Relation<Gallery>;

  @Column({
    type: 'varchar',
    name: 'title',
  })
  title!: string;

  @Column({
    type: 'varchar',
    name: 'image_url',
    unique: true,
  })
  imageUrl!: string;

  @Column({
    type: 'varchar',
    name: 'image_public_id',
  })
  imagePublicId!: string;

  @Column({
    type: 'int',
    name: 'position',
    default: 0,
  })
  position?: number;

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
}