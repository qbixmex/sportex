import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';
import { Gallery } from '../galleries/entities/gallery.entity.js';
import { GalleryImagesController } from './gallery-images.controller.js';
import { GalleryImagesService } from './gallery-images.service.js';
import { GalleryImage } from './entities/gallery-image.entity.js';

@Module({
  controllers: [GalleryImagesController],
  providers: [GalleryImagesService],
  imports: [
    TypeOrmModule.forFeature([GalleryImage, Gallery]),
    AuthModule,
    CommonModule,
  ],
})
export class GalleryImagesModule {}