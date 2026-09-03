import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';
import { Team } from '@/modules/teams/entities/team.entity';
import { CommonService } from '@/common/common.service';

describe('PlayersService', () => {
  let service: PlayersService;
  let playerRepo: Record<string, jest.Mock>;
  let teamRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    playerRepo = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    teamRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Player),
          useValue: playerRepo,
        },
        {
          provide: getRepositoryToken(Team),
          useValue: teamRepo,
        },
        {
          provide: CommonService,
          useValue: { handleExceptions: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(PlayersService);
  });

  describe('create', () => {
    it('creates a player without team when teamId is not provided', async () => {
      playerRepo.create.mockImplementation((data: object) => ({
        id: 'player-1',
        ...data,
        active: false,
      }));
      playerRepo.save.mockImplementation(async (player: object) => player);

      const result = await service.create({ name: 'Jugador A' });

      expect(playerRepo.create).toHaveBeenCalledWith({
        name: 'Jugador A',
        email: undefined,
        phone: undefined,
        birthday: undefined,
        nationality: undefined,
        imageUrl: undefined,
        imagePublicId: undefined,
        active: undefined,
        team: undefined,
      });
      expect(result.data).toMatchObject({ name: 'Jugador A' });
    });

    it('rejects a player referencing a nonexistent team', async () => {
      teamRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ name: 'Jugador B', teamId: 'abc-123' }),
      ).rejects.toThrow(BadRequestException);
      expect(playerRepo.save).not.toHaveBeenCalled();
    });

    it('creates a player referencing an existing team', async () => {
      teamRepo.findOne.mockResolvedValue({ id: 'team-1' } as Team);
      playerRepo.create.mockImplementation((data: object) => ({
        id: 'player-2',
        ...data,
      }));
      playerRepo.save.mockImplementation(async (player: object) => player);

      const result = await service.create({
        name: 'Jugador C',
        teamId: 'team-1',
      });

      expect(teamRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'team-1' },
      });
      expect(result.data).toMatchObject({ team: { id: 'team-1' } });
    });
  });

  describe('findAll', () => {
    it('returns paginated players', async () => {
      playerRepo.count.mockResolvedValue(1);
      playerRepo.find.mockResolvedValue([
        { id: 'player-1', name: 'Jugador A' },
      ]);

      const result = await service.findAll({ page: 1, take: 10 });

      expect(playerRepo.find).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        relations: { team: true },
      });
      expect(result.pagination).toMatchObject({
        currentPage: 1,
        totalPages: 1,
      });
    });
  });

  describe('findById', () => {
    it('throws NotFoundException when the player does not exist', async () => {
      playerRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns the player with its team relation', async () => {
      const player = {
        id: 'player-1',
        name: 'Jugador A',
        team: null,
      } as unknown as Player;
      playerRepo.findOne.mockResolvedValue(player);

      await expect(service.findById('player-1')).resolves.toBe(player);
      expect(playerRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'player-1' },
        relations: { team: true },
      });
    });
  });

  describe('update', () => {
    it('throws NotFoundException when the player does not exist', async () => {
      playerRepo.findOne.mockResolvedValue(null);

      await expect(service.update('missing-id', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('assigns a team to an existing player', async () => {
      const player = { id: 'player-1', name: 'A' } as unknown as Player;
      playerRepo.findOne.mockResolvedValue(player);
      teamRepo.findOne.mockResolvedValue({ id: 'team-1' } as Team);
      playerRepo.merge = jest.fn((p: Player, dto: object) => ({
        ...p,
        ...dto,
      }));
      playerRepo.save.mockImplementation(async (p: object) => p);

      const result = await service.update('player-1', { teamId: 'team-1' });

      expect(teamRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'team-1' },
      });
      expect(result.data.team).toEqual({ id: 'team-1' });
    });

    it('rejects assigning a nonexistent team', async () => {
      const player = { id: 'player-1', name: 'A' } as unknown as Player;
      playerRepo.findOne.mockResolvedValue(player);
      teamRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('player-1', { teamId: 'nonexistent' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when the player does not exist', async () => {
      playerRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deletes an existing player', async () => {
      const player = { id: 'player-1', name: 'Jugador A' } as unknown as Player;
      playerRepo.findOne.mockResolvedValue(player);
      playerRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('player-1');

      expect(playerRepo.delete).toHaveBeenCalledWith({ id: 'player-1' });
      expect(result.data).toEqual(player);
    });
  });
});
