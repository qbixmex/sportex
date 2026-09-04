import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Field } from './field.entity';
import { Team } from '@/modules/teams/entities/team.entity';

@Entity({ name: 'field_team' })
export class FieldTeam {
  @PrimaryColumn({ type: 'uuid', name: 'field_id' })
  fieldId!: string;

  @PrimaryColumn({ type: 'uuid', name: 'team_id' })
  teamId!: string;

  @ManyToOne(() => Field, (field) => field.fieldTeams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'field_id' })
  field!: Field;

  @ManyToOne(() => Team, (team) => team.fieldTeams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team!: Team;
}
