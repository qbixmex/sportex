import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { CommonService } from '@/common/common.service';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let repository: Record<string, jest.Mock>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      merge: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        {
          provide: getRepositoryToken(Announcement),
          useValue: repository,
        },
        {
          provide: CommonService,
          useValue: { handleExceptions: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AnnouncementsService);
  });

  describe('Announcement.formatPermalink', () => {
    it('lowercases, strips accents and separates words with dashes', () => {
      expect(Announcement.formatPermalink('¡Final del Torneo Árbitro 2024!')).toBe(
        'final-del-torneo-arbitro-2024',
      );
    });

    it('removes leading and trailing whitespace and dashes', () => {
      expect(Announcement.formatPermalink('  Una Noticia  ')).toBe('una-noticia');
    });
  });

  describe('Announcement entity hooks', () => {
    it('derives the permalink from the title on insert', () => {
      const announcement = new Announcement();
      announcement.title = 'Hola Mundo';
      announcement.transformPermalinkInsert();
      expect(announcement.permalink).toBe('hola-mundo');
    });

    it('regenerates the permalink from the updated title', () => {
      const announcement = new Announcement();
      announcement.title = 'Nuevo Título Oficial';
      announcement.transformPermalinkUpdate();
      expect(announcement.permalink).toBe('nuevo-titulo-oficial');
    });

    it('keeps a provided permalink normalized on insert', () => {
      const announcement = new Announcement();
      announcement.title = 'Hola';
      announcement.permalink = 'Mi  Permalink!!';
      announcement.transformPermalinkInsert();
      expect(announcement.permalink).toBe('mi-permalink');
    });

    it('keeps a provided permalink normalized on update', () => {
      const announcement = new Announcement();
      announcement.title = 'Otro';
      announcement.permalink = 'Ruta  Personalizada!!';
      announcement.transformPermalinkUpdate();
      expect(announcement.permalink).toBe('ruta-personalizada');
    });
  });

  describe('CreateAnnouncementDto validation', () => {
    it('rejects a DTO without title or content', async () => {
      const dto = plainToInstance(CreateAnnouncementDto, { title: 'x' });
      const errors = await validate(dto);
      expect(errors.some((error) => error.property === 'content')).toBe(true);
    });

    it('rejects a DTO without description', async () => {
      const dto = plainToInstance(CreateAnnouncementDto, {
        title: 'Una noticia',
        content: 'Contenido',
      });
      const errors = await validate(dto);
      expect(errors.some((error) => error.property === 'description')).toBe(true);
    });

    it('rejects a title shorter than 3 characters', async () => {
      const dto = plainToInstance(CreateAnnouncementDto, {
        title: 'ab',
        content: 'Contenido',
        description: 'Descripción de prueba',
      });
      const errors = await validate(dto);
      expect(errors.some((error) => error.property === 'title')).toBe(true);
    });

    it('rejects content shorter than 8 characters', async () => {
      const dto = plainToInstance(CreateAnnouncementDto, {
        title: 'Una noticia',
        content: 'corto',
        description: 'Descripción de prueba',
      });
      const errors = await validate(dto);
      expect(errors.some((error) => error.property === 'content')).toBe(true);
    });

    it('rejects an image URL that does not use https', async () => {
      const dto = plainToInstance(CreateAnnouncementDto, {
        title: 'Una noticia',
        content: 'Contenido',
        description: 'Descripción de prueba',
        imageUrl: 'http://imagen.com/foto.png',
      });
      const errors = await validate(dto);
      expect(errors.some((error) => error.property === 'imageUrl')).toBe(true);
    });

    it('accepts a valid DTO', async () => {
      const dto = plainToInstance(CreateAnnouncementDto, {
        title: 'Una noticia',
        content: 'Contenido',
        description: 'Descripción de prueba',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('accepts a valid DTO with a custom permalink', async () => {
      const dto = plainToInstance(CreateAnnouncementDto, {
        title: 'Una noticia',
        content: 'Contenido',
        description: 'Descripción de prueba',
        permalink: 'mi-permalink',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('rejects a permalink shorter than 3 characters', async () => {
      const dto = plainToInstance(CreateAnnouncementDto, {
        title: 'Una noticia',
        content: 'Contenido',
        description: 'Descripción de prueba',
        permalink: 'mi',
      });
      const errors = await validate(dto);
      expect(errors.some((error) => error.property === 'permalink')).toBe(true);
    });
  });

  describe('create', () => {
    it('creates an announcement inactive by default', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data: object) => ({
        id: 'ann-1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      repository.save.mockImplementation((announcement: object) => announcement);

      const result = await service.create({
        title: 'Una noticia',
        content: 'Contenido',
        description: 'Descripción de prueba',
      });

      expect(repository.create).toHaveBeenCalledWith({
        title: 'Una noticia',
        content: 'Contenido',
        description: 'Descripción de prueba',
        permalink: 'una-noticia',
        active: false,
      });
      expect(result.active).toBe(false);
      expect(result.permalink).toBe('una-noticia');
    });

    it('checks the normalized permalink for uniqueness', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data: object) => ({
        id: 'ann-1',
        ...data,
      }));
      repository.save.mockImplementation((announcement: object) => announcement);

      await service.create({
        title: 'Un Título Nuevo',
        content: 'Contenido',
        description: 'Descripción de prueba',
      });

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { permalink: 'un-titulo-nuevo' },
      });
    });

    it('throws ConflictException when the permalink already exists', async () => {
      repository.findOne.mockResolvedValue({ id: 'ann-other' });

      await expect(
        service.create({
          title: 'Título Duplicado',
          content: 'Contenido',
          description: 'Descripción de prueba',
        }),
      ).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('normalizes the provided permalink and lets it win over the title', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data: object) => ({
        id: 'ann-1',
        ...data,
      }));
      repository.save.mockImplementation((announcement: object) => announcement);

      const result = await service.create({
        title: 'Título que se ignora',
        content: 'Contenido',
        description: 'Descripción de prueba',
        permalink: 'Mi  Permalink!!',
      });

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { permalink: 'mi-permalink' },
      });
      expect(repository.create).toHaveBeenCalledWith({
        title: 'Título que se ignora',
        content: 'Contenido',
        description: 'Descripción de prueba',
        permalink: 'mi-permalink',
        active: false,
      });
      expect(result.permalink).toBe('mi-permalink');
    });

    it('rejects a permalink that is empty after normalization', async () => {
      await expect(
        service.create({
          title: 'Válido',
          content: 'Contenido',
          description: 'Descripción de prueba',
          permalink: '!!!',
        }),
      ).rejects.toThrow(BadRequestException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('persists optional data and explicit active state', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data: object) => ({
        id: 'ann-1',
        ...data,
      }));
      repository.save.mockImplementation((announcement: object) => announcement);

      const dto: CreateAnnouncementDto = {
        title: 'Con opcionales',
        content: 'Contenido',
        publishedAt: '2026-09-04T12:00:00.000Z',
        imageUrl: 'https://img',
        imagePublicId: 'img-public',
        description: 'Descripción',
        active: true,
      };

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        permalink: 'con-opcionales',
      });
      expect(result.active).toBe(true);
      expect(result.publishedAt).toBe(dto.publishedAt);
    });
  });

  describe('findAll', () => {
    const buildQueryBuilder = (announcements: object[], count: number) => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(count),
        getMany: jest.fn().mockResolvedValue(announcements),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder);
      return queryBuilder;
    };

    it('returns all announcements for the administrative scope in database order', async () => {
      const queryBuilder = buildQueryBuilder(
        [{ id: 'ann-1', title: 'Activa', active: true }],
        5,
      );

      const result = await service.findAll({ page: 1, take: 2 });

      expect(queryBuilder.where).not.toHaveBeenCalled();
      expect(queryBuilder.orderBy).not.toHaveBeenCalled();
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('announcement');
      expect(result.announcements).toHaveLength(1);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(3);
    });

    it('filters by active state for the public scope', async () => {
      const queryBuilder = buildQueryBuilder(
        [{ id: 'ann-active', title: 'Solo activa', active: true }],
        1,
      );

      const result = await service.findAll({ page: 1, take: 10 }, true);

      expect(queryBuilder.where).toHaveBeenCalledWith(
        'announcement.active = :active',
        { active: true },
      );
      expect(result.announcements.map((announcement) => announcement.id)).toEqual([
        'ann-active',
      ]);
    });
  });

  describe('findById', () => {
    it('returns an announcement by id even when inactive in administrative scope', async () => {
      const announcement = { id: 'ann-1', title: 'Inactiva', active: false };
      repository.findOne.mockResolvedValue(announcement);

      await expect(service.findById('ann-1')).resolves.toBe(announcement);
    });

    it('treats an inactive announcement as not found in public scope', async () => {
      repository.findOne.mockResolvedValue({
        id: 'ann-1',
        title: 'Inactiva',
        active: false,
      });

      await expect(service.findById('ann-1', true)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns an active announcement in public scope', async () => {
      const announcement = { id: 'ann-1', title: 'Activa', active: true };
      repository.findOne.mockResolvedValue(announcement);

      await expect(service.findById('ann-1', true)).resolves.toBe(announcement);
    });

    it('throws NotFoundException for a non-existent announcement', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('regenerates the permalink when the title changes', async () => {
      repository.findOne.mockResolvedValueOnce({
        id: 'ann-1',
        title: 'Antiguo',
        permalink: 'antiguo',
        content: 'Contenido',
      });
      repository.findOne.mockResolvedValueOnce(null);
      repository.merge.mockImplementation((announcement: object, dto: object) => ({
        ...announcement,
        ...dto,
      }));
      repository.save.mockImplementation((announcement: object) => announcement);

      const result = await service.update('ann-1', {
        title: 'Nuevo Título',
      });

      expect(repository.findOne).toHaveBeenLastCalledWith({
        where: { permalink: 'nuevo-titulo' },
      });
      expect(result.announcement.title).toBe('Nuevo Título');
    });

    it('throws ConflictException when the new permalink is already used by another announcement', async () => {
      repository.findOne.mockResolvedValueOnce({
        id: 'ann-1',
        title: 'Antiguo',
        permalink: 'antiguo',
      });
      repository.findOne.mockResolvedValueOnce({ id: 'ann-other' });

      await expect(
        service.update('ann-1', { title: 'Título Usado' }),
      ).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('prefers the provided permalink over the title change', async () => {
      repository.findOne.mockResolvedValueOnce({
        id: 'ann-1',
        title: 'Antiguo',
        permalink: 'antiguo',
      });
      repository.findOne.mockResolvedValueOnce(null);
      repository.merge.mockImplementation((announcement: object, dto: object) => ({
        ...announcement,
        ...dto,
      }));
      repository.save.mockImplementation((announcement: object) => announcement);

      const result = await service.update('ann-1', {
        title: 'Nuevo Título',
        permalink: 'Mi  Permalink!!',
      });

      expect(repository.findOne).toHaveBeenLastCalledWith({
        where: { permalink: 'mi-permalink' },
      });
      expect(result.announcement.permalink).toBe('mi-permalink');
    });

    it('keeps the permalink unchanged when only other fields change', async () => {
      repository.findOne.mockResolvedValueOnce({
        id: 'ann-1',
        title: 'Antiguo',
        permalink: 'antiguo',
      });
      repository.merge.mockImplementation((announcement: object, dto: object) => ({
        ...announcement,
        ...dto,
      }));
      repository.save.mockImplementation((announcement: object) => announcement);

      const result = await service.update('ann-1', { content: 'Nuevo contenido' });

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(result.announcement.permalink).toBe('antiguo');
    });

    it('rejects a permalink that is empty after normalization', async () => {
      repository.findOne.mockResolvedValueOnce({
        id: 'ann-1',
        title: 'Antiguo',
        permalink: 'antiguo',
      });

      await expect(
        service.update('ann-1', { permalink: '!!!' }),
      ).rejects.toThrow(BadRequestException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('throws ConflictException when the provided permalink is used by another announcement', async () => {
      repository.findOne.mockResolvedValueOnce({
        id: 'ann-1',
        title: 'Antiguo',
        permalink: 'antiguo',
      });
      repository.findOne.mockResolvedValueOnce({ id: 'ann-other' });

      await expect(
        service.update('ann-1', { permalink: 'Nuevo Custom' }),
      ).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the announcement does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('missing-id', { content: 'Nuevo' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('activates and deactivates an announcement via the active flag', async () => {
      repository.findOne.mockResolvedValueOnce({
        id: 'ann-1',
        title: 'Inactiva',
        permalink: 'inactiva',
        active: false,
      });
      repository.findOne.mockResolvedValueOnce(null);
      repository.merge.mockImplementation((announcement: object, dto: object) => ({
        ...announcement,
        ...dto,
      }));
      repository.save.mockImplementation((announcement: object) => announcement);

      const result = await service.update('ann-1', { active: true });

      expect(result.announcement.active).toBe(true);
    });
  });

  describe('remove', () => {
    it('removes an existing announcement', async () => {
      const announcement = { id: 'ann-1', title: 'Para borrar' };
      repository.findOne.mockResolvedValue(announcement);
      repository.remove.mockResolvedValue(announcement);

      const result = await service.remove('ann-1');

      expect(repository.remove).toHaveBeenCalledWith(announcement);
      expect(result.message).toBeDefined();
    });

    it('throws NotFoundException when the announcement does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(NotFoundException);
    });
  });
});