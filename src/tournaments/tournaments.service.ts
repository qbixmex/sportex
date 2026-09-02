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
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class TournamentsService {
  private readonly logger = new Logger('TournamentsService');

  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) { }

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    try {
      const [tournamentsCount, tournaments] = await Promise.all([
        this.tournamentRepository.count(),
        this.tournamentRepository.find({
          take,
          skip: (page - 1) * take,
        }),
      ]);

      return {
        tournaments,
        pagination: {
        currentPage: +page,
          totalPages: Math.ceil(tournamentsCount / take),
        },
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findById(id: string) {
    let tournament: Tournament | null = null;

    if (isUUID(id)) {
      tournament = await this.tournamentRepository.findOneBy({ id });
    } else {
      const queryBuilder = this.tournamentRepository.createQueryBuilder();
      tournament = await queryBuilder
        .where('permalink = :permalink', { permalink: id.toLowerCase() })
        .getOne();
    }

    if (!tournament) {
      throw new NotFoundException(
        '¡ El torneo con '
         + (isUUID(id) ? 'id ' : 'enlace permanente ')
         + `[${id}] no existe en la base de datos !`
      );
    }

    return tournament;
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
      };
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

  private handleExceptions(error: unknown): never {
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
