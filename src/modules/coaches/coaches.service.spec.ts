import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { Coach } from './entities/coach.entity';
import { Team } from '@/modules/teams/entities/team.entity';
import { CommonService } from '@/common/common.service';

describe('CoachesService', () => {
  let service: CoachesService;
  let coachRepo: Record<string, jest.Mock>;
  let teamRepo: Record<string, jest.Mock>;
  let commonService: { handleExceptions: jest.Mock };

  beforeEach(async () => {
    coachRepo = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    };
    teamRepo = {
      find: jest.fn(),
      save: jest.fn(),
    };
    commonService = { handleExceptions: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachesService,
        {
          provide: getRepositoryToken(Coach),
          useValue: coachRepo,
        },
        {
          provide: getRepositoryToken(Team),
          useValue: teamRepo,
        },
        {
          provide: CommonService,
          useValue: commonService,
        },
      ],
    }).compile();

    service = module.get(CoachesService);
  });

  describe('create', () => {
    it('creates a coach without teams when teamIds is not provided', async () => {
      coachRepo.create.mockImplementation((data: object) => ({
        id: 'coach-1',
        ...data,
        active: false,
      }));
      coachRepo.save.mockImplementation(async (coach: object) => coach);

      const result = await service.create({ name: 'Entrenador A', email: 'a@x.com' });

      expect(coachRepo.create).toHaveBeenCalledWith({
        name: 'Entrenador A',
        email: 'a@x.com',
        phone: undefined,
        age: undefined,
        nationality: undefined,
        imageUrl: undefined,
        imagePublicId: undefined,
        description: undefined,
        active: undefined,
      });
      expect(teamRepo.find).not.toHaveBeenCalled();
      expect(teamRepo.save).not.toHaveBeenCalled();
      expect(result.data).toMatchObject({ name: 'Entrenador A' });
    });

    it('creates a coach referencing existing teams', async () => {
      teamRepo.find.mockResolvedValue([{ id: 'team-1' }, { id: 'team-2' }] as Team[]);
      teamRepo.save.mockImplementation(async (team: Team) => team);
      coachRepo.create.mockImplementation((data: object) => ({
        id: 'coach-1',
        ...data,
      }));
      coachRepo.save.mockImplementation(async (coach: object) => coach);

      const result = await service.create({
        name: 'Entrenador A',
        email: 'a@x.com',
        teamIds: ['team-1', 'team-2'],
      });

      expect(result.data).toMatchObject({ name: 'Entrenador A' });
      expect(teamRepo.save).toHaveBeenCalled();
    });

    it('rejects a coach referencing a nonexistent team', async () => {
      teamRepo.find.mockResolvedValue([]);

      await expect(
        service.create({ name: 'Entrenador B', email: 'b@x.com', teamIds: ['missing'] }),
      ).rejects.toThrow(BadRequestException);
      expect(coachRepo.save).not.toHaveBeenCalled();
    });

    it('propagates errors through commonService (e.g. duplicated email)', async () => {
      commonService.handleExceptions.mockImplementation(() => {
        throw new BadRequestException('email ya existe, elija otro');
      });
      coachRepo.create.mockImplementation((data: object) => ({ id: 'coach-1', ...data }));
      coachRepo.save.mockRejectedValue(new Error('23505 unique violation'));

      await expect(
        service.create({ name: 'Entrenador A', email: 'dup@x.com' }),
      ).rejects.toThrow(BadRequestException);
      expect(commonService.handleExceptions).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns paginated coaches', async () => {
      coachRepo.count.mockResolvedValue(1);
      coachRepo.find.mockResolvedValue([{ id: 'coach-1', name: 'Entrenador A' }]);

      const result = await service.findAll({ page: 1, take: 10 });

      expect(coachRepo.find).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        relations: { teams: true },
        select: { teams: { id: true, name: true } },
      });
      expect(result.pagination).toMatchObject({ currentPage: 1, totalPages: 1 });
    });
  });

  describe('findById', () => {
    it('throws NotFoundException when the coach does not exist', async () => {
      coachRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns the coach with its teams relation', async () => {
      const coach = {
        id: 'coach-1',
        name: 'Entrenador A',
        teams: [],
      } as unknown as Coach;
      coachRepo.findOne.mockResolvedValue(coach);

      await expect(service.findById('coach-1')).resolves.toBe(coach);
      expect(coachRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'coach-1' },
        relations: { teams: true },
        select: { teams: { id: true, name: true } },
      });
    });
  });

  describe('update', () => {
    it('throws NotFoundException when the coach does not exist', async () => {
      coachRepo.findOne.mockResolvedValue(null);

      await expect(service.update('missing-id', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('synchronizes teams when teamIds is provided', async () => {
      const coach = { id: 'coach-1', name: 'A' } as unknown as Coach;
      coachRepo.findOne.mockResolvedValue(coach);
      coachRepo.merge = jest.fn((c: Coach, dto: object) => ({ ...c, ...dto }));
      coachRepo.save.mockImplementation(async (c: object) => c);
      teamRepo.save.mockImplementation(async (team: Team) => team);
      teamRepo.find.mockResolvedValue([{ id: 'team-1' }] as Team[]);

      const result = await service.update('coach-1', { teamIds: ['team-1'] });

      expect(result.data).toMatchObject({ id: 'coach-1', name: 'A' });
      expect(teamRepo.save).toHaveBeenCalled();
    });

    it('rejects updating with a nonexistent team', async () => {
      const coach = { id: 'coach-1', name: 'A' } as unknown as Coach;
      coachRepo.findOne.mockResolvedValue(coach);
      coachRepo.merge = jest.fn((c: Coach, dto: object) => ({ ...c, ...dto }));
      coachRepo.save.mockImplementation(async (c: object) => c);
      teamRepo.find.mockResolvedValue([]);

      await expect(
        service.update('coach-1', { teamIds: ['missing'] }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when the coach does not exist', async () => {
      coachRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('desassociates teams and deletes an existing coach', async () => {
      const coach = { id: 'coach-1', name: 'Entrenador A' } as unknown as Coach;
      coachRepo.findOne.mockResolvedValue(coach);
      coachRepo.delete.mockResolvedValue({ affected: 1 });
      teamRepo.find.mockResolvedValue([{ id: 'team-1' }] as Team[]);
      teamRepo.save.mockImplementation(async (team: Team) => team);

      const result = await service.remove('coach-1');

      expect(teamRepo.save).toHaveBeenCalled();
      expect(coachRepo.delete).toHaveBeenCalledWith({ id: 'coach-1' });
      expect(result.data).toEqual(coach);
    });
  });
});
