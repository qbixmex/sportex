import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service.js';
import { TeamsController } from './teams.controller.js';
import { Team } from './entities/team.entity.js';
import { Tournament } from '#/modules/tournaments/entities/tournament.entity.js';
import { Category } from '#/modules/categories/entities/category.entity.js';
import { AuthModule } from '#/modules/auth/auth.module.js';
import { CommonModule } from '#/modules/common/common.module.js';

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