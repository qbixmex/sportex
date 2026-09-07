import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service.js';
import { CreateGalleryImageDto } from './dto/create-gallery-image.dto.js';
import { GalleryImagesService } from './gallery-images.service.js';
import { GalleryImage } from './entities/gallery-image.entity.js';
import { Gallery } from '../galleries/entities/gallery.entity.js';

function buildService() {
  const galleryImageRepo = {
    createQueryBuilder: vi.fn(),
    findOne: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    merge: vi.fn(),
    remove: vi.fn(),
  };
  const galleryRepo = {
    findOne: vi.fn(),
  };
  const commonService = {
    handleExceptions: vi.fn((error: unknown) => {
      throw error;
    }),
  };

  const service = new GalleryImagesService(
    galleryImageRepo as unknown as Repository<GalleryImage>,
    galleryRepo as unknown as Repository<Gallery>,
    commonService as unknown as CommonService,
  );

  return { service, galleryImageRepo, galleryRepo, commonService };
}

function createGalleryImageDto(
  overrides: Partial<CreateGalleryImageDto> = {},
): CreateGalleryImageDto {
  return {
    title: 'Imagen Principal',
    imageUrl: 'https://img.example.com/photo.jpg',
    imagePublicId: 'gallery/photo',
    ...overrides,
  };
}

describe('GalleryImagesService', () => {
  describe('create', () => {
    it('crea la imagen inactiva por defecto cuando la galería existe', async () => {
      const { service, galleryRepo, galleryImageRepo } = buildService();

      galleryRepo.findOne.mockResolvedValue({ id: 'gallery-1' });
      galleryImageRepo.findOne.mockResolvedValue(null);
      galleryImageRepo.create.mockImplementation(
        (data: CreateGalleryImageDto) => data,
      );
      galleryImageRepo.save.mockResolvedValue({ id: 'img-1', active: false });

      await service.create('gallery-1', createGalleryImageDto());

      expect(galleryImageRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: 'https://img.example.com/photo.jpg',
          active: false,
        }),
      );
    });

    it('lanza NotFoundException cuando la galería no existe', async () => {
      const { service, galleryRepo } = buildService();

      galleryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create('gallery-inexistente', createGalleryImageDto()),
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza ConflictException cuando el url de la imagen ya existe', async () => {
      const { service, galleryRepo, galleryImageRepo } = buildService();

      galleryRepo.findOne.mockResolvedValue({ id: 'gallery-1' });
      galleryImageRepo.count.mockResolvedValue(1);

      await expect(
        service.create('gallery-1', createGalleryImageDto()),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('devuelve solo las imágenes de la galería, ordenadas por posición y luego por antigüedad, y pagina', async () => {
      const { service, galleryRepo, galleryImageRepo } = buildService();

      galleryRepo.findOne.mockResolvedValue({ id: 'gallery-1' });

      const galleryImages = [{ id: 'a' }, { id: 'b' }];
      const dataBuilder = {
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        addOrderBy: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(galleryImages),
      };
      const countBuilder = {
        where: vi.fn().mockReturnThis(),
        getCount: vi.fn().mockResolvedValue(2),
      };

      galleryImageRepo.createQueryBuilder
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(dataBuilder);

      const result = await service.findAll('gallery-1', { page: 1, take: 10 });

      expect(dataBuilder.where).toHaveBeenCalledWith(
        'galleryImage.gallery = :galleryId',
        { galleryId: 'gallery-1' },
      );
      expect(dataBuilder.orderBy).toHaveBeenCalledWith(
        'galleryImage.position',
        'ASC',
      );
      expect(dataBuilder.addOrderBy).toHaveBeenCalledWith(
        'galleryImage.createdAt',
        'ASC',
      );
      expect(result).toEqual({
        galleryImages,
        pagination: { currentPage: 1, totalPages: 1 },
      });
    });

    it('lanza NotFoundException cuando la galería no existe', async () => {
      const { service, galleryRepo } = buildService();

      galleryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findAll('gallery-inexistente', { page: 1, take: 10 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('lanza NotFoundException cuando la imagen no existe en la galería', async () => {
      const { service, galleryRepo, galleryImageRepo } = buildService();

      galleryRepo.findOne.mockResolvedValue({ id: 'gallery-1' });
      galleryImageRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findById('gallery-1', 'id-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });

    it('devuelve la imagen sin incluir la galería anidada', async () => {
      const { service, galleryRepo, galleryImageRepo } = buildService();

      galleryRepo.findOne.mockResolvedValue({ id: 'gallery-1' });
      galleryImageRepo.findOne.mockResolvedValue({
        id: 'img-1',
        title: 'Imagen Principal',
        active: true,
        gallery: { id: 'gallery-1', title: 'Galería', permalink: 'galeria' },
      });

      const result = await service.findById('gallery-1', 'img-1');

      expect(result).toEqual({
        id: 'img-1',
        title: 'Imagen Principal',
        active: true,
      });
      expect(result).not.toHaveProperty('gallery');
    });
  });

  describe('update', () => {
    it('fusiona los cambios y devuelve la imagen actualizada', async () => {
      const { service, galleryRepo, galleryImageRepo } = buildService();

      galleryRepo.findOne.mockResolvedValue({ id: 'gallery-1' });
      const existing = {
        id: 'img-1',
        imageUrl: 'https://img.example.com/photo.jpg',
        active: false,
        gallery: { id: 'gallery-1', title: 'Galería', permalink: 'galeria' },
      };
      galleryImageRepo.findOne.mockResolvedValue(existing);
      galleryImageRepo.merge.mockImplementation(
        (base: GalleryImage, data: Partial<GalleryImage>) => ({
          ...base,
          ...data,
        }),
      );
      galleryImageRepo.save.mockResolvedValue({ ...existing, active: true });

      const result = await service.update('gallery-1', 'img-1', {
        active: true,
      });

      expect(result).toEqual({
        message: expect.stringContaining('actualizada'),
        galleryImage: {
          id: 'img-1',
          imageUrl: 'https://img.example.com/photo.jpg',
          active: true,
        },
      });
      expect(result.galleryImage).not.toHaveProperty('gallery');
    });
  });

  describe('remove', () => {
    it('elimina la imagen y confirma la eliminación', async () => {
      const { service, galleryRepo, galleryImageRepo } = buildService();

      galleryRepo.findOne.mockResolvedValue({ id: 'gallery-1' });
      const existing = { id: 'img-1' };
      galleryImageRepo.findOne.mockResolvedValue(existing);
      galleryImageRepo.remove.mockResolvedValue(existing);

      const result = await service.remove('gallery-1', 'img-1');

      expect(galleryImageRepo.remove).toHaveBeenCalledWith(existing);
      expect(result).toEqual({
        message: expect.stringContaining('eliminada'),
      });
    });
  });
});