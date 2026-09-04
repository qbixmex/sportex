import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { Field } from './entities/field.entity';
import { CommonService } from '@/common/common.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

describe('FieldsService', () => {
  let service: FieldsService;
  let fieldRepo: Record<string, jest.Mock>;
  let commonService: Record<string, jest.Mock>;

  beforeEach(async () => {
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };
    fieldRepo = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };
    commonService = {
      handleExceptions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldsService,
        {
          provide: getRepositoryToken(Field),
          useValue: fieldRepo,
        },
        {
          provide: CommonService,
          useValue: commonService,
        },
      ],
    }).compile();

    service = module.get(FieldsService);
  });

  describe('findAll', () => {
    it('returns paginated fields', async () => {
      const paginationDto: PaginationDto = { page: 1, take: 10 };
      fieldRepo.count.mockResolvedValue(1);
      fieldRepo.find.mockResolvedValue([{ id: 'f-1', name: 'Cancha 1' }]);

      const result = await service.findAll(paginationDto);

      expect(result.fields).toHaveLength(1);
      expect(result.pagination).toMatchObject({ currentPage: 1, totalPages: 1 });
      expect(fieldRepo.find).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findById', () => {
    it('finds a field by uuid', async () => {
      const field = { id: 'f-1', name: 'Cancha 1', fieldTeams: [] } as unknown as Field;
      fieldRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(field),
      });

      const result = await service.findById('f-1');

      expect(fieldRepo.createQueryBuilder).toHaveBeenCalledWith('field');
      expect(result).toEqual(field);
    });

    it('finds a field by permalink (case-insensitive)', async () => {
      const field = { id: 'f-2', name: 'Cancha 2', fieldTeams: [] } as unknown as Field;
      fieldRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(field),
      });

      const result = await service.findById('cancha-2');

      expect(fieldRepo.createQueryBuilder).toHaveBeenCalledWith('field');
      expect(result).toEqual(field);
    });

    it('throws NotFoundException when the field does not exist', async () => {
      fieldRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates a field when permalink is not duplicated', async () => {
      fieldRepo.count.mockResolvedValue(0);
      fieldRepo.create.mockImplementation((data: object) => ({ id: 'f-1', ...data }));
      fieldRepo.save.mockImplementation(async (f: object) => f);

      const result = await service.create({ name: 'Cancha A' });

      expect(fieldRepo.create).toHaveBeenCalledWith({ name: 'Cancha A' });
      expect(result.data).toMatchObject({ name: 'Cancha A' });
      expect(fieldRepo.save).toHaveBeenCalled();
    });

    it('rejects a field with a duplicated permalink', async () => {
      fieldRepo.count.mockResolvedValue(1);

      await expect(
        service.create({ name: 'Cancha B', permalink: 'cancha-b' }),
      ).rejects.toThrow(BadRequestException);
      expect(fieldRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates an existing field', async () => {
      const field = { id: 'f-1', name: 'Cancha A' } as unknown as Field;
      fieldRepo.findOne.mockResolvedValue(field);
      fieldRepo.save.mockImplementation(async (f: object) => f);

      const result = await service.update('f-1', { name: 'Cancha Updated' });

      expect(result.data).toMatchObject({ name: 'Cancha Updated' });
      expect(fieldRepo.save).toHaveBeenCalled();
    });

    it('throws NotFoundException when updating a nonexistent field', async () => {
      fieldRepo.findOne.mockResolvedValue(null);

      await expect(service.update('missing', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('rejects an update with a duplicated permalink', async () => {
      const field = { id: 'f-1', name: 'Cancha A' } as unknown as Field;
      fieldRepo.findOne.mockResolvedValue(field);
      fieldRepo.count.mockResolvedValue(1);

      await expect(
        service.update('f-1', { permalink: 'taken' }),
      ).rejects.toThrow(BadRequestException);
      expect(fieldRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when the field does not exist', async () => {
      fieldRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deletes an existing field', async () => {
      const field = { id: 'f-1' } as unknown as Field;
      fieldRepo.findOne.mockResolvedValue(field);
      fieldRepo.delete.mockResolvedValue({});

      await expect(service.remove('f-1')).resolves.toMatchObject({
        message: expect.stringContaining('Cancha eliminada'),
      });
      expect(fieldRepo.delete).toHaveBeenCalledWith({ id: 'f-1' });
    });
  });
});
