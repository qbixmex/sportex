import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { CommonModule } from '@/common/common.module';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';

@Module({
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  imports: [TypeOrmModule.forFeature([Announcement]), AuthModule, CommonModule],
})
export class AnnouncementsModule {}