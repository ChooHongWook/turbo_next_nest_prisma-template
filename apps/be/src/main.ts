import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Redis 클라이언트 생성
  const redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();
  console.log('✅ Redis connected for session store');

  // Redis 기반 세션 스토어 설정
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
  });

  // Express Session 미들웨어 설정
  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: undefined, // 기본값: 브라우저 세션 (rememberMe 시 변경)
      },
      name: 'session_id',
    }),
  );

  // CORS 설정 (credentials 허용)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Turbo Monorepo API')
    .setDescription('API documentation for NestJS backend')
    .setVersion('1.0')
    .addTag('users')
    .addTag('links')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}

void bootstrap();
