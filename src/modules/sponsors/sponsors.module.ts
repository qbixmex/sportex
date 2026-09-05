import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorsController } from './sponsors.controller';
import { SponsorsService } from './sponsors.service';
import { AuthModule } from '@/auth/auth.module';
import { Sponsor } from './entities/sponsor.entity';
import { CommonModule } from '@/common/common.module';

@Module({
  controllers: [SponsorsController],
  providers: [SponsorsService],
  imports: [
    TypeOrmModule.forFeature([Sponsor]),
    AuthModule,
    CommonModule,
  ],
})
export class SponsorsModule {}