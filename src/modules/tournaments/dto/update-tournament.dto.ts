import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentDto } from './create-tournament.dto.js';

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {}
