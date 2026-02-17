import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import helmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ trustProxy: true });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  await app.register(fastifyCookie, {
    secret: process.env.FASTIFY_COOKIE_SECRET,
  });
  await app.register(helmet);
  await app.register(multipart);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

    await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
