import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';
import { VideosController } from './videos.controller.js';
import { VideosService } from './videos.service.js';
import { Video } from './entities/video.entity.js';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
  imports: [TypeOrmModule.forFeature([Video]), AuthModule, CommonModule],
})
export class VideosModule {}