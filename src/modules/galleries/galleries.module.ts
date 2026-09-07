import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';
import { GalleriesController } from './galleries.controller.js';
import { GalleriesService } from './galleries.service.js';
import { Gallery } from './entities/gallery.entity.js';

@Module({
  controllers: [GalleriesController],
  providers: [GalleriesService],
  imports: [TypeOrmModule.forFeature([Gallery]), AuthModule, CommonModule],
})
export class GalleriesModule {}