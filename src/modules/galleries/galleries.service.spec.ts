import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service.js';
import { CreateGalleryDto } from './dto/create-gallery.dto.js';
import { GalleriesService } from './galleries.service.js';
import { Gallery } from './entities/gallery.entity.js';

function buildService() {
  const repo = {
    createQueryBuilder: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    merge: vi.fn(),
    remove: vi.fn(),
  };
  const commonService = {
    handleExceptions: vi.fn((error: unknown) => {
      throw error;
    }),
  };

  const service = new GalleriesService(
    repo as unknown as Repository<Gallery>,
    commonService as unknown as CommonService,
  );

  return { service, repo, commonService };
}

function createGalleryDto(overrides: Partial<CreateGalleryDto> = {}): CreateGalleryDto {
  return {
    title: 'Galería Final',
    ...overrides,
  };
}

describe('GalleriesService', () => {
  describe('create', () => {
    it('genera el enlace permanente a partir del título y deja la galería inactiva por defecto', async () => {
      const { service, repo } = buildService();

      repo.findOne.mockResolvedValue(null);
      repo.create.mockImplementation((data: CreateGalleryDto) => data);
      repo.save.mockResolvedValue({ id: 'uuid-1', active: false });

      await service.create(createGalleryDto());

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ permalink: 'galeria-final', active: false }),
      );
    });

    it('lanza ConflictException cuando el enlace permanente ya existe', async () => {
      const { service, repo } = buildService();

      repo.findOne.mockResolvedValue({ id: 'otra-galeria' });

      await expect(service.create(createGalleryDto())).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('ordena por fecha de creación de más antiguas a más recientes y pagina', async () => {
      const { service, repo } = buildService();

      const galleries = [{ id: 'a' }, { id: 'b' }];
      const dataBuilder = {
        orderBy: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(galleries),
      };
      const countBuilder = {
        getCount: vi.fn().mockResolvedValue(2),
      };

      repo.createQueryBuilder
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(dataBuilder);

      const result = await service.findAll({ page: 1, take: 10 });

      expect(dataBuilder.orderBy).toHaveBeenCalledWith('gallery.createdAt', 'ASC');
      expect(result).toEqual({
        galleries,
        pagination: { currentPage: 1, totalPages: 1 },
      });
    });
  });

  describe('findById', () => {
    it('lanza NotFoundException cuando la galería no existe', async () => {
      const { service, repo } = buildService();

      repo.findOne.mockResolvedValue(null);

      await expect(service.findById('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('fusiona los cambios y devuelve la galería actualizada', async () => {
      const { service, repo } = buildService();

      const existing = { id: 'uuid-1', permalink: 'galeria-final', active: false };
      repo.findOne.mockResolvedValue(existing);
      repo.merge.mockImplementation(
        (base: Gallery, data: Partial<Gallery>) => ({ ...base, ...data }),
      );
      repo.save.mockResolvedValue({ ...existing, active: true });

      const result = await service.update('uuid-1', { active: true });

      expect(result).toEqual({
        message: expect.stringContaining('actualizada'),
        gallery: { ...existing, active: true },
      });
    });
  });

  describe('remove', () => {
    it('elimina la galería y confirma la eliminación', async () => {
      const { service, repo } = buildService();

      const existing = { id: 'uuid-1' };
      repo.findOne.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(existing);

      const result = await service.remove('uuid-1');

      expect(repo.remove).toHaveBeenCalledWith(existing);
      expect(result).toEqual({
        message: expect.stringContaining('eliminada'),
      });
    });
  });
});