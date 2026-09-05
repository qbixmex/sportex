import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorsController } from './sponsors.controller.js';
import { SponsorsService } from './sponsors.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { Sponsor } from './entities/sponsor.entity.js';
import { CommonModule } from '../common/common.module.js';

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