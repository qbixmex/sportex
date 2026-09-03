import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Tournament } from "@/tournaments/entities/tournament.entity";
import { Team } from "@/teams/entities/team.entity";

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
  tournaments!: Tournament[];

  @OneToMany(() => Team, (team) => team.category)
  teams!: Team[];
}
