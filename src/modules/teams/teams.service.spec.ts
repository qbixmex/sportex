import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';
import { Tournament } from '@/modules/tournaments/entities/tournament.entity';
import { CommonService } from '@/common/common.service';

describe('TeamsService', () => {
  let service: TeamsService;
  let teamRepo: Record<string, jest.Mock>;
  let tournamentRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    teamRepo = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    tournamentRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: teamRepo,
        },
        {
          provide: getRepositoryToken(Tournament),
          useValue: tournamentRepo,
        },
        {
          provide: CommonService,
          useValue: { handleExceptions: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(TeamsService);
  });

  describe('create', () => {
    it('creates a team without tournament when tournamentId is not provided', async () => {
      teamRepo.count.mockResolvedValue(0);
      teamRepo.create.mockImplementation((data: object) => ({ id: 'team-1', ...data }));
      teamRepo.save.mockImplementation(async (team: object) => team);

      const result = await service.create({ name: 'Equipo A' });

      expect(teamRepo.create).toHaveBeenCalledWith({
        name: 'Equipo A',
        imageUrl: undefined,
        imagePublicId: undefined,
        description: undefined,
        tournament: undefined,
      });
      expect(result.data).toMatchObject({ name: 'Equipo A' });
    });

    it('rejects a team with a duplicated name', async () => {
      teamRepo.count.mockResolvedValue(1);

      await expect(service.create({ name: 'Equipo A' })).rejects.toThrow(
        BadRequestException,
      );
      expect(teamRepo.save).not.toHaveBeenCalled();
    });

    it('rejects a team referencing a nonexistent tournament', async () => {
      teamRepo.count.mockResolvedValue(0);
      tournamentRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ name: 'Equipo B', tournamentId: 'abc-123' }),
      ).rejects.toThrow(BadRequestException);
      expect(teamRepo.save).not.toHaveBeenCalled();
    });

    it('creates a team referencing an existing tournament', async () => {
      teamRepo.count.mockResolvedValue(0);
      tournamentRepo.findOne.mockResolvedValue({ id: 'tour-1' } as Tournament);
      teamRepo.create.mockImplementation((data: object) => ({ id: 'team-2', ...data }));
      teamRepo.save.mockImplementation(async (team: object) => team);

      const result = await service.create({
        name: 'Equipo C',
        tournamentId: 'tour-1',
      });

      expect(tournamentRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'tour-1' },
      });
      expect(result.data).toMatchObject({ tournament: { id: 'tour-1' } });
    });
  });

  describe('findById', () => {
    it('throws NotFoundException when the team does not exist', async () => {
      teamRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns the team with its tournament relation', async () => {
      const team = { id: 'team-1', name: 'Equipo A', tournament: null } as unknown as Team;
      teamRepo.findOne.mockResolvedValue(team);

      await expect(service.findById('team-1')).resolves.toBe(team);
      expect(teamRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'team-1' },
        relations: { tournament: true },
      });
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when the team does not exist', async () => {
      teamRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});