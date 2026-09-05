import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersService } from './players.service.js';
import { PlayersController } from './players.controller.js';
import { Player } from './entities/player.entity.js';
import { Team } from '../teams/entities/team.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Player, Team]),
    AuthModule,
    CommonModule,
  ],
})
export class PlayersModule {}
