import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Tournament])
  ],
})
export class TournamentsModule {}
