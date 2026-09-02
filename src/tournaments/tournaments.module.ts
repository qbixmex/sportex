import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { AuthModule } from '@/auth/auth.module';
import { CommonModule } from '@/common/common.module';

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
