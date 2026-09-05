import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './utils/transform.interceptor.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  console.log('1. BOOTSTRAP');
  const app = await NestFactory.create(AppModule);
  console.log('2. NEST CREATED');
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  console.log('3. CONFIGURED');
  await app.listen(process.env.PORT ?? 4000);
  console.log('4. LISTENING');
}
await bootstrap();
