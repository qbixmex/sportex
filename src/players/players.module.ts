import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Team } from '@/teams/entities/team.entity';
import { AuthModule } from '@/auth/auth.module';
import { CommonModule } from '@/common/common.module';

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
