import 'reflect-metadata';
import '@/core/infrastructure/container';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './global-filter.exception';
import { setupSwagger } from './documentation/setup.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3333);

  setupSwagger(app);

  await app.listen(port);

  console.log(`Services Billing server application is running on port ${port}`);
}
bootstrap();
