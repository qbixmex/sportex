import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachesController } from './coaches.controller.js';
import { CoachesService } from './coaches.service.js';
import { Coach } from './entities/coach.entity.js';
import { Team } from '../teams/entities/team.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';

@Module({
  controllers: [CoachesController],
  providers: [CoachesService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Coach, Team]),
    AuthModule,
    CommonModule,
  ],
})
export class CoachesModule {}
