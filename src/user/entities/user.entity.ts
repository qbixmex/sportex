import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'name',
    length: 200,
  })
  name!: string;

  @Column({
    type: 'varchar',
    name: 'username',
    length: 200,
  })
  username?: string;

  @Column({
    type: 'varchar',
    name: 'email',
  })
  email!: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
  })
  emailVerified?: boolean;

  @Column({
    type: 'varchar',
    name: 'image_url',
    nullable: true,
  })
  imageUrl?: string;

  @Column({
    type: 'varchar',
    name: 'image_public_id',
    nullable: true,
  })
  imagePublicId?: string;

  @Column({
    type: 'varchar',
    name: 'password',
  })
  password!: string;

  @Column({
    type: 'boolean',
    name: 'is_active',
    default: false,
  })
  isActive?: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_date',
    nullable: true,
  })
  updatedAt?: Date;
}
