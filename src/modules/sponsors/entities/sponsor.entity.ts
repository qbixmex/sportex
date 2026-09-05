import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sponsors' })
export class Sponsor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'name',
    unique: true,
  })
  name!: string;

  @Column({
    type: 'varchar',
    name: 'url',
    nullable: true,
  })
  url?: string;

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
    type: 'date',
    name: 'startDate',
    nullable: true,
  })
  startDate?: Date;

  @Column({
    type: 'date',
    name: 'endDate',
    nullable: true,
  })
  endDate?: Date;

  @Column({
    type: 'int',
    name: 'position',
    default: 0,
  })
  position: number = 0;

  @Column({
    type: 'int',
    name: 'clicks',
    default: 0,
  })
  clicks: number = 0;

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
}