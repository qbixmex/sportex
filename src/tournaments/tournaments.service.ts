import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTournamentDto, UpdateTournamentDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) { }

  async findAll() {
    return await this.tournamentRepository.find();
  }

  async findById(id: string) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException(`El usuario con id: [${id}], no existe en la base de datos`)
    }

    return tournament;
  }

  async findByPermalink(permalink: string) {
    const tournament = await this.tournamentRepository.findOne({
      where: { permalink },
    });

    if (!tournament) {
      throw new NotFoundException(`¡ El usuario con el enlace permanente: [${permalink}], no existe en la base de datos !`)
    }

    return tournament;
  }

  async create(dto: CreateTournamentDto) {
    const tournamentNameCount = await this.tournamentRepository.count({
      where: { name: dto.name },
    });

    if (tournamentNameCount > 0) {
      throw new BadRequestException(
        `¡ El torneo con el nombre ${dto.name} ya existe, elija otro !`
      );
    }

    try {
      const newTournament = this.tournamentRepository.create(dto);

      await this.tournamentRepository.save(newTournament);

      return {
        message: '¡ Torneo creado satisfactoriamente 👍 !',
        data: newTournament
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('¡ Error desconocido, revisa los logs para mas información !');
    }

  }

  async update(id: string, dto: UpdateTournamentDto) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException(
        `¡ El torneo con id: [${id}], no existe en la base de datos !`
      );
    }

    const updatedTournament = this.tournamentRepository.merge(tournament, dto);

    try {
      await this.tournamentRepository.save(updatedTournament);

      return {
        message: 'Torneo actualizado exitosamente 👍',
        data: updatedTournament,
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '¡ Error desconocido, revisa los logs para mas información !'
      );
    }
  }

  async remove(id: string) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException(
        `El torneo con id: [${id}], no existe en la base de datos`
      );
    }

    try {
      await this.tournamentRepository.delete({ id: tournament.id });

      return {
        message: 'Torneo eliminado satisfactoriamente 👍',
        user: tournament,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('¡ Error desconocido, revisa los logs para mas información !');
    }
  }
}
