import { join } from 'node:path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ApiKeyMiddleware } from './middleware/api-key.middleware';
import { UserController } from './user/user.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TournamentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(UserController);
  }
}
