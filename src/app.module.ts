import { join } from 'node:path';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/user.module';
import { ApiKeyMiddleware } from './middleware/api-key.middleware';
import { UserController } from './users/user.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TournamentsModule } from './tournaments/tournaments.module';
import { envConfiguration } from './config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ envConfiguration ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? ''),
      database: process.env.DB_NAME ?? '',
      username: process.env.DB_USER ?? '',
      password: process.env.DB_PASSWORD ?? '',
      autoLoadEntities: true,
      synchronize: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsersModule,
    TournamentsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(UserController);
  }
}
