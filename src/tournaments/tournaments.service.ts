import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentsService {
  create(dto: CreateTournamentDto) {
    return 'This action adds a new tournament';
  }

  findAll() {
    return `This action returns all tournaments`;
  }

  findOne(id: string) {
    return `Tournament ID: [${id}]`;
  }

  update(id: string, dto: UpdateTournamentDto) {
    return `Tournament ID: [${id}], updated`;
  }

  remove(id: string) {
    return `Tournament with ID: [${id}], deleted`;
  }
}
