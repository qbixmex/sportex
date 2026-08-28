import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Version,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Version('1')
  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Version('1')
  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Version('1')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tournamentsService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tournamentsService.remove(id);
  }
}
