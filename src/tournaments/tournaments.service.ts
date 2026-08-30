import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateTournamentDto, UpdateTournamentDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentsService {
  private readonly logger = new Logger('TournamentsService');

  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) { }

  async findAll() {
    try {
      return await this.tournamentRepository.find();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findById(id: string) {
    try {
      const tournament = await this.tournamentRepository.findOne({
        where: { id },
      });

      if (!tournament) {
        throw new NotFoundException(`El usuario con id: [${id}], no existe en la base de datos`)
      }

      return tournament;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByPermalink(permalink: string) {
    try {
      const tournament = await this.tournamentRepository.findOne({
        where: { permalink },
      });

      if (!tournament) {
        throw new NotFoundException(`¡ El usuario con el enlace permanente: [${permalink}], no existe en la base de datos !`)
      }

      return tournament;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async create(dto: CreateTournamentDto) {
    const tournamentNameCount = await this.tournamentRepository.count({
      where: { name: dto.name },
    });

    if (tournamentNameCount > 0) {
      throw new BadRequestException(
        `¡ El torneo con el nombre (${dto.name}) ya existe, elija otro !`
      );
    }

    if (dto.permalink) {
      const tournamentPermalinkCount = await this.tournamentRepository.count({
        where: { permalink: dto.permalink },
      });

      if (tournamentPermalinkCount > 0) {
        throw new BadRequestException(
          `¡ El torneo con el nombre permanente (${dto.permalink}) ya existe, elija otro !`
        );
      }
    }

    try {
      const newTournament = this.tournamentRepository.create(dto);

      await this.tournamentRepository.save(newTournament);

      return {
        message: '¡ Torneo creado satisfactoriamente 👍 !',
        data: newTournament
      }
    } catch (error) {
      this.handleExceptions(error);
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
      this.handleExceptions(error);
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
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: unknown) {
    if (error instanceof QueryFailedError) {
      this.logger.error(`📌 Database Error (TypeORM):\n${error.message}`);
      this.logger.error(`Postgres Code: ${error.driverError?.code}`);
      if (error.driverError?.code === '23505') {
        const columnError = (error.driverError?.detail as string).split('=')[1].split(' ')[0];
        const errorMessage = `${columnError} ya existe, elija otro`;
        this.logger.error(errorMessage);
        throw new BadRequestException('Database Error', errorMessage);
      }
    } else if (error instanceof Error) {
      this.logger.error(`📌 Message:\n${error.message}`);
      this.logger.error(`Stack trace:\n${error.stack}`);
    } else {
      this.logger.error(error);
    }
    throw new InternalServerErrorException('¡ Error desconocido, revisa los logs para mas información !');
  }
}
