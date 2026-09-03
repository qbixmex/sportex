import { Module } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CoachesController } from './coaches.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from './entities/coach.entity';
import { Team } from '@/modules/teams/entities/team.entity';
import { AuthModule } from '@/auth/auth.module';
import { CommonModule } from '@/common/common.module';

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
