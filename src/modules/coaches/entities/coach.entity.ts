import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from '@/modules/teams/entities/team.entity';

@Entity({ name: 'coaches' })
export class Coach {
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
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    name: 'phone',
    nullable: true,
  })
  phone?: string;

  @Column({
    type: 'int',
    name: 'age',
    nullable: true,
  })
  age?: number;

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
    type: 'varchar',
    name: 'description',
    nullable: true,
  })
  description?: string;

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
  @OneToMany(() => Team, (team) => team.coach)
  teams!: Team[];
}
