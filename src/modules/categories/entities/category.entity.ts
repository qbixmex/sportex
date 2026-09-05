import type { Relation } from "typeorm";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Tournament } from "#/modules/tournaments/entities/tournament.entity.js";
import { Team } from "#/modules/teams/entities/team.entity.js";

@Entity({ name: 'categories' })
export class Category {
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
    unique: true,
  })
  permalink!: string;

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
  @ManyToMany(() => Tournament, (tournament) => tournament.categories)
  tournaments!: Relation<Tournament>[];

  @OneToMany(() => Team, (team) => team.category)
  teams!: Relation<Team>[];
}
