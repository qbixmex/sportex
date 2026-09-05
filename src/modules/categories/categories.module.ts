import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Category]),
    AuthModule,
    CommonModule,
  ],
})
export class CategoriesModule {}
