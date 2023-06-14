import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as session from "express-session"
import * as passport from "passport"
import * as dotenv from "dotenv";
import * as cors from "cors";

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule)

    // Enable CORS
    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
      exposedHeaders: ["set-cookie"],
    }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      // cookie: {
      //   maxAge: 6 * 60 * 60 * 1000, // Session duration in milliseconds (1 day)
      // },
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  await app.listen(5000)
}
bootstrap()