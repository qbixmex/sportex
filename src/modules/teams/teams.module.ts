import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service.js';
import { TeamsController } from './teams.controller.js';
import { Team } from './entities/team.entity.js';
import { Tournament } from '../tournaments/entities/tournament.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Team, Tournament, Category]),
    AuthModule,
    CommonModule,
  ],
})
export class TeamsModule {}