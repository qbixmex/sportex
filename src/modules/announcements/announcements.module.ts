import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '#/modules/auth/auth.module.js';
import { CommonModule } from '#/modules/common/common.module.js';
import { AnnouncementsController } from './announcements.controller.js';
import { AnnouncementsService } from './announcements.service.js';
import { Announcement } from './entities/announcement.entity.js';

@Module({
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  imports: [TypeOrmModule.forFeature([Announcement]), AuthModule, CommonModule],
})
export class AnnouncementsModule {}