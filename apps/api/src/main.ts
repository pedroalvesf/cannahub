import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isDev = process.env.NODE_ENV !== 'production';

  app.use(
    helmet({
      contentSecurityPolicy: isDev ? false : undefined,
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type, Authorization, x-ipaddress, x-operatingsystem, x-browser, x-type',
  });

  const port = parseInt(process.env.PORT || '3000');

  await app.listen(port);

  console.log(`CannHub API running on port ${port}`);
}

bootstrap().catch(console.error);
