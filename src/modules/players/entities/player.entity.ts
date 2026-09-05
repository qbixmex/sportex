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
import { Team } from '#/modules/teams/entities/team.entity.js';

@Entity({ name: 'players' })
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'name',
  })
  name!: string;

  @Column({
    type: 'varchar',
    name: 'email',
    nullable: true,
  })
  email?: string;

  @Column({
    type: 'varchar',
    name: 'phone',
    nullable: true,
  })
  phone?: string;

  @Column({
    type: 'date',
    name: 'birthday',
    nullable: true,
  })
  birthday?: Date;

  @Column({
    type: 'varchar',
    name: 'nationality',
    nullable: true,
  })
  nationality?: string;

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
  @ManyToOne(() => Team, (team) => team.players, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'team_id' })
  team?: Relation<Team>;
}
