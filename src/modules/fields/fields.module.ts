import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service.js';
import { FieldsController } from './fields.controller.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './entities/field.entity.js';
import { FieldTeam } from './entities/field-team.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';

@Module({
  controllers: [FieldsController],
  providers: [FieldsService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Field, FieldTeam]),
    AuthModule,
    CommonModule,
  ],
})
export class FieldsModule {}
