import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../../auth/auth.module';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    AuthModule,
    CommonModule,
  ],
})
export class UsersModule {}
