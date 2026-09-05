import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTournamentDto, UpdateTournamentDto } from './dto/index.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity.js';
import { PaginationDto } from '#/modules/common/dto/pagination.dto.js';
import { validate as isUUID } from 'uuid';
import { CommonService } from '#/modules/common/common.service.js';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    private readonly commonService: CommonService,
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
      this.commonService.handleExceptions(error);
    }
  }

  async findById(id: string) {
    const queryBuilder = this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoin('tournament.categories', 'category')
      .addSelect(['category.id', 'category.name', 'category.permalink']);


    if (isUUID(id)) {
      queryBuilder.where('tournament.id = :id', { id });
    } else {
      queryBuilder.where('tournament.permalink = :permalink', {
        permalink: id.toLowerCase(),
      });
    }

    const tournament = await queryBuilder.getOne();

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
      this.commonService.handleExceptions(error);
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
      this.commonService.handleExceptions(error);
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
      this.commonService.handleExceptions(error);
    }
  }
}
