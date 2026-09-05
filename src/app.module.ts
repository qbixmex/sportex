import { join } from 'node:path';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/user.module';
import { ApiKeyMiddleware } from './middleware/api-key.middleware';
import { UserController } from './modules/users/user.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { envConfiguration } from './config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PlayersModule } from './modules/players/players.module';
import { CoachesModule } from './modules/coaches/coaches.module';
import { FieldsModule } from './modules/fields/fields.module';
import { SponsorsModule } from './modules/sponsors/sponsors.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';

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
      logging: false, // for debugging sql sentences
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsersModule,
    AuthModule,
    TournamentsModule,
    CommonModule,
    CategoriesModule,
    TeamsModule,
    PlayersModule,
    CoachesModule,
    FieldsModule,
    SponsorsModule,
    AnnouncementsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(UserController);
  }
}
