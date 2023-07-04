import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.use(
    cors({
      origin: 'https://todo-app-frontend-bay.vercel.app',
      credentials: true,
      exposedHeaders: ['set-cookie'],
    }),
  );

  // Enable session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(5000);
}
bootstrap();
