import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { AuthService } from "./auth/auth.service"
import { SetsModule } from "./sets/sets.module"
import { TablesModule } from "./tables/tables.module"

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://dbUser:W2RbhqWyDQMAfjWL@atlascluster.nsprpuw.mongodb.net/?retryWrites=true&w=majority"),
    UsersModule,
    AuthModule,
    SetsModule,
    TablesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}