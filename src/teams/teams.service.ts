import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto, UpdateTeamDto } from './dto';
import { Team } from './entities/team.entity';
import { Tournament } from '@/tournaments/entities/tournament.entity';
import { Category } from '@/categories/entities/category.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { CommonService } from '@/common/common.service';
import { isUUID } from 'class-validator';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly commonService: CommonService,
  ) {}

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    try {
      const [teamsCount, teams] = await Promise.all([
        this.teamRepository.count(),
        this.teamRepository.find({
          take,
          skip: (page - 1) * take,
          relations: { tournament: true },
        }),
      ]);

      return {
        teams,
        pagination: {
          currentPage: +page,
          totalPages: Math.ceil(teamsCount / take),
        },
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async findById(id: string) {
    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .leftJoin('team.tournament', 'tournament')
      .leftJoin('team.category', 'category')
      .addSelect([
        'tournament.id',
        'tournament.name',
        'tournament.permalink',
        'category.id',
        'category.name',
        'category.permalink',
      ]);

    if (isUUID(id)) {
      queryBuilder.where('team.id = :id', { id });
    } else {
      queryBuilder.where('team.permalink = :permalink', {
        permalink: id.toLowerCase(),
      });
    }

    const team = await queryBuilder.getOne();

    if (!team) {
      throw new NotFoundException(
        '¡ El equipo con '
         + (isUUID(id) ? 'id ' : 'enlace permanente ')
         + `[${id}] no existe en la base de datos !`
      );
    }

    return team;

  }

  async create(dto: CreateTeamDto) {
    if (dto.tournamentId) {
      await this.ensureTournamentExists(dto.tournamentId);
    }

    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    try {
      const newTeam = this.teamRepository.create({
        name: dto.name,
        permalink: dto.permalink,
        format: dto.format,
        gender: dto.gender,
        imageUrl: dto.imageUrl,
        imagePublicId: dto.imagePublicId,
        country: dto.country,
        city: dto.city,
        state: dto.state,
        emails: dto.emails,
        address: dto.address,
        active: dto.active,
        tournament: dto.tournamentId ? { id: dto.tournamentId } : undefined,
        category: dto.categoryId ? { id: dto.categoryId } : undefined,
      });

      await this.teamRepository.save(newTeam);

      return {
        message: '¡ Equipo creado satisfactoriamente 👍 !',
        data: newTeam,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateTeamDto) {
    console.log(dto);

    const team = await this.teamRepository.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException(
        `¡ El equipo con id: [${id}], no existe en la base de datos !`
      );
    }

    if (dto.tournamentId !== undefined) {
      if (dto.tournamentId) {
        await this.ensureTournamentExists(dto.tournamentId);
        team.tournament = { id: dto.tournamentId } as Tournament;
      } else {
        team.tournament = undefined as unknown as Tournament;
      }
    }

    if (dto.categoryId !== undefined) {
      if (dto.categoryId) {
        await this.ensureCategoryExists(dto.categoryId);
        team.category = { id: dto.categoryId } as Category;
      } else {
        team.category = undefined as unknown as Category;
      }
    }

    const updatedTeam = this.teamRepository.merge(team, dto);

    try {
      await this.teamRepository.save(updatedTeam);

      return {
        message: 'Equipo actualizado exitosamente 👍',
        data: updatedTeam,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const team = await this.teamRepository.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException(
        `El equipo con id: [${id}], no existe en la base de datos`
      );
    }

    try {
      await this.teamRepository.delete({ id: team.id });

      return {
        message: 'Equipo eliminado satisfactoriamente 👍',
        data: team,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  private async ensureTournamentExists(tournamentId: string) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new BadRequestException(
        `¡ El torneo con id [${tournamentId}] no existe, elija otro !`
      );
    }
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new BadRequestException(
        `¡ La categoría con id [${categoryId}] no existe, elija otra !`
      );
    }
  }
}