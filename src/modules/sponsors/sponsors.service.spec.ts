import { Test, { flushPromises } } from '@nestjs/testing';
import { SponsorsService } from './sponsors.service';
import { Sponsor } from './entities/sponsor.entity';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('SponsorsService', () => {
  let service: SponsorsService;
  let sponsorRepository: Repository<Sponsor>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SponsorsService,
        {
          provide: getRepositoryToken(Sponsor),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SponsorsService>(SponsorsService);
    sponsorRepository = module.get<Repository<Sponsor>>(getRepositoryToken(Sponsor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a sponsor with valid data', async () => {
      const createDto: CreateSponsorDto = {
        name: 'Test Sponsor',
      };
      const sponsor = await service.create(createDto);
      expect(sponsor.name).toBe('Test Sponsor');
      expect(sponsor.active).toBe(false);
      expect(sponsor.position).toBe(0);
      expect(sponsor.clicks).toBe(0);
    });

    it('should throw ConflictException on duplicate name', async () => {
      const createDto: CreateSponsorDto = {
        name: 'Duplicate Sponsor',
      };
      await service.create(createDto);
      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated sponsors', async () => {
      const result = await service.findAll(1, 10);
      expect(result.items).toBeDefined();
      expect(result.count).toBeDefined();
      expect(result.page).toBe(1);
      expect(result.totalPages).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return a sponsor by id', async () => {
      const createDto: CreateSponsorDto = { name: 'Test Sponsor' };
      const created = await service.create(createDto);
      const sponsor = await service.findById(created.id);
      expect(sponsor).toBeDefined();
      expect(sponsor.name).toBe('Test Sponsor');
    });

    it('should throw NotFoundException for non-existent id', async () => {
      await expect(service.findById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a sponsor', async () => {
      const createDto: CreateSponsorDto = { name: 'Original Sponsor' };
      const created = await service.create(createDto);
      const updateDto: UpdateSponsorDto = { name: 'Updated Sponsor' };
      const updated = await service.update(created.id, updateDto);
      expect(updated.name).toBe('Updated Sponsor');
    });

    it('should throw ConflictException on duplicate name in update', async () => {
      const createDto1: CreateSponsorDto = { name: 'Original Sponsor' };
      const createDto2: CreateSponsorDto = { name: 'Duplicate Sponsor' };
      await service.create(createDto1);
      await service.create(createDto2);
      await expect(
        service.update(createDto1.id, { name: 'Duplicate Sponsor' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a sponsor', async () => {
      const createDto: CreateSponsorDto = { name: 'Sponsor to Remove' };
      const created = await service.create(createDto);
      await service.remove(created.id);
      const found = await service.findById(created.id);
      expect(found).toBeNull();
    });
  });
});