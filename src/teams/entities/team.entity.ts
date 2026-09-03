import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tournament } from '@/tournaments/entities/tournament.entity';
import { Category } from '@/categories/entities/category.entity';
import { Gender, GENDER } from '@/teams/enums';

@Entity({ name: 'teams' })
@Index(['permalink', 'format'])
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'name',
  })
  name!: string;

  @Column({
    type: 'varchar',
    name: 'permalink',
  })
  permalink!: string;

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
    name: 'format',
  })
  format!: string;

  @Column({
    type: 'enum',
    enum: Object.values(GENDER),
    name: 'gender',
    default: GENDER.MALE,
  })
  gender!: Gender;

  @Column({
    type: 'varchar',
    name: 'country',
    nullable: true,
  })
  country?: string;

  @Column({
    type: 'varchar',
    name: 'city',
    nullable: true,
  })
  city?: string;

  @Column({
    type: 'varchar',
    name: 'state',
    nullable: true,
  })
  state?: string;

  @Column({
    type: 'varchar',
    name: 'emails',
    array: true,
    default: [],
  })
  emails!: string[];

  @Column({
    type: 'varchar',
    name: 'address',
    nullable: true,
  })
  address?: string;

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

  // Relationships
  @ManyToOne(() => Tournament, (tournament) => tournament.teams, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'tournament_id' })
  tournament?: Tournament;

  @ManyToOne(() => Category, (category) => category.teams, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category;
}