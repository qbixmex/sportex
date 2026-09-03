import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Tournament } from '@/modules/tournaments/entities/tournament.entity';
import { Category } from '@/modules/categories/entities/category.entity';
import { AuthModule } from '@/auth/auth.module';
import { CommonModule } from '@/common/common.module';

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