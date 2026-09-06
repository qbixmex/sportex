import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service.js';
import { CreateVideoDto } from './dto/create-video.dto.js';
import { VideosService } from './videos.service.js';
import { Video } from './entities/video.entity.js';

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

  const service = new VideosService(
    repo as unknown as Repository<Video>,
    commonService as unknown as CommonService,
  );

  return { service, repo, commonService };
}

function createVideoDto(overrides: Partial<CreateVideoDto> = {}): CreateVideoDto {
  return {
    title: 'Resumen Final',
    url: 'https://www.youtube.com/watch?v=abc123',
    platform: 'YouTube',
    ...overrides,
  };
}

describe('VideosService', () => {
  describe('create', () => {
    it('genera el enlace permanente a partir del título y deja el video inactivo por defecto', async () => {
      const { service, repo } = buildService();

      repo.findOne.mockResolvedValue(null);
      repo.create.mockImplementation((data: CreateVideoDto) => data);
      repo.save.mockResolvedValue({ id: 'uuid-1', active: false });

      await service.create(createVideoDto());

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ permalink: 'resumen-final', active: false }),
      );
    });

    it('lanza ConflictException cuando el enlace permanente ya existe', async () => {
      const { service, repo } = buildService();

      repo.findOne.mockResolvedValue({ id: 'otro-video' });

      await expect(service.create(createVideoDto())).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('ordena por fecha de creación de más antiguos a más recientes y pagina', async () => {
      const { service, repo } = buildService();

      const videos = [{ id: 'a' }, { id: 'b' }];
      const dataBuilder = {
        orderBy: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(videos),
      };
      const countBuilder = {
        getCount: vi.fn().mockResolvedValue(2),
      };

      repo.createQueryBuilder
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(dataBuilder);

      const result = await service.findAll({ page: 1, take: 10 });

      expect(dataBuilder.orderBy).toHaveBeenCalledWith('video.createdAt', 'ASC');
      expect(result).toEqual({
        videos,
        pagination: { currentPage: 1, totalPages: 1 },
      });
    });
  });

  describe('findById', () => {
    it('lanza NotFoundException cuando el video no existe', async () => {
      const { service, repo } = buildService();

      repo.findOne.mockResolvedValue(null);

      await expect(service.findById('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('fusiona los cambios y devuelve el video actualizado', async () => {
      const { service, repo } = buildService();

      const existing = { id: 'uuid-1', permalink: 'resumen-final', active: false };
      repo.findOne.mockResolvedValue(existing);
      repo.merge.mockImplementation(
        (base: Video, data: Partial<Video>) => ({ ...base, ...data }),
      );
      repo.save.mockResolvedValue({ ...existing, platform: 'Vimeo' });

      const result = await service.update('uuid-1', { platform: 'Vimeo' });

      expect(result).toEqual({
        message: expect.stringContaining('actualizado'),
        video: { ...existing, platform: 'Vimeo' },
      });
    });
  });

  describe('remove', () => {
    it('elimina el video y confirma la eliminación', async () => {
      const { service, repo } = buildService();

      const existing = { id: 'uuid-1' };
      repo.findOne.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(existing);

      const result = await service.remove('uuid-1');

      expect(repo.remove).toHaveBeenCalledWith(existing);
      expect(result).toEqual({
        message: expect.stringContaining('eliminado'),
        video: existing,
      });
    });
  });
});