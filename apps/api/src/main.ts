import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { loadServerConfig } from '@jandrishti/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const config = loadServerConfig(process.env);
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  await app.listen(config.port);
}

void bootstrap();

