import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { FieldTeam } from './entities/field-team.entity';
import { AuthModule } from '@/auth/auth.module';
import { CommonModule } from '@/common/common.module';

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
