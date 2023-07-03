import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { SetsModule } from './sets/sets.module';
import { TablesModule } from './tables/tables.module';
import { InvitationsModule } from './invitations/invitations.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
    UsersModule,
    AuthModule,
    SetsModule,
    TablesModule,
    InvitationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
