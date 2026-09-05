import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service.js';
import { TournamentsController } from './tournaments.controller.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity.js';
import { AuthModule } from '#/modules/auth/auth.module.js';
import { CommonModule } from '#/modules/common/common.module.js';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Tournament]),
    AuthModule,
    CommonModule,
  ],
})
export class TournamentsModule {}
