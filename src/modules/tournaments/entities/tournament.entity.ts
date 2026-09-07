import type { Relation } from "typeorm";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity.js';
import { Team } from '../../teams/entities/team.entity.js';
import { formatPermalinkOrSlug } from '../../../utils/format_permalink.util.js';

@Entity({ name: 'tournaments' })
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'name',
    length: 200,
    unique: true,
  })
  name!: string;

  @Column({
    type: 'varchar',
    name: 'permalink',
    length: 200,
    unique: true,
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
    name: 'description',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar',
    name: 'stage',
    default: 'regular',
  })
  stage?: string;

  @Column({
    type: 'varchar',
    name: 'country',
    nullable: true,
  })
  country?: string;

  @Column({
    type: 'varchar',
    name: 'state',
    nullable: true,
  })
  state?: string;

  @Column({
    type: 'varchar',
    name: 'city',
    nullable: true,
  })
  city?: string;

  @Column({
    type: 'varchar',
    name: 'season',
    nullable: true,
  })
  season?: string;

  @Column({
    type: 'timestamptz',
    name: 'start_date',
  })
  startDate!: Date;

  @Column({
    type: 'timestamptz',
    name: 'end_date',
  })
  endDate!: Date;

  @Column({
    type: 'boolean',
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
  @ManyToMany(() => Category, (category) => category.tournaments)
  @JoinTable({
    name: 'category_tournament',
    joinColumn: { name: 'tournament_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories!: Relation<Category>[];

  @OneToMany(() => Team, (team) => team.tournament)
  teams!: Relation<Team>[];

  @BeforeInsert()
  transformPermalinkInsert() {
    if (!this.permalink) {
      this.permalink = this.name;
    }

    this.permalink = formatPermalinkOrSlug(this.permalink);
  }

  @BeforeUpdate()
  transformPermalinkUpdate() {
    this.permalink = formatPermalinkOrSlug(this.permalink);
  }
}
