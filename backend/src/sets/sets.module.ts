import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { SetsController } from "./sets.controller"
import { SetSchema } from "./sets.model"
import { SetsService } from "./sets.service"
@Module({
  imports: [MongooseModule.forFeature([{ name: "set", schema: SetSchema }])],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService],
})
export class SetsModule {}