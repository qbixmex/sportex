import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FieldTeam } from './field-team.entity';

@Entity({ name: 'fields' })
export class Field {
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
    nullable: true,
    unique: true,
  })
  permalink?: string;

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
    name: 'country',
    nullable: true,
  })
  country?: string;

  @Column({
    type: 'varchar',
    name: 'address',
    nullable: true,
  })
  address?: string;

  @Column({
    type: 'varchar',
    name: 'map',
    nullable: true,
  })
  map?: string;

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
  @OneToMany(() => FieldTeam, (fieldTeam) => fieldTeam.field)
  fieldTeams!: FieldTeam[];
}
