import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UsersController } from "./users.controller"
import { UserSchema } from "./users.model"
import { UsersService } from "./users.service"
import { SetsService } from "src/sets/sets.service"
import { SetsModule } from "src/sets/sets.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: "user", schema: UserSchema }]), SetsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}