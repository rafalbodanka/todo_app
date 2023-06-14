import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TablesController } from "./controllers/tables.controller"
import { ColumnsController } from "./controllers/columns.controller"
import { TasksController } from "./controllers/tasks.controller"
import { TableSchema, ColumnSchema, TaskSchema } from "./tables.model"
import { TablesService } from "./services/tables.service"
import { ColumnsService } from "./services/columns.service"
import { TasksService } from "./services/tasks.service"

@Module({
  imports: [MongooseModule.forFeature([
    { name: "table", schema: TableSchema },
    { name: "column", schema: ColumnSchema},
    { name: "task", schema: TaskSchema}])],
  controllers: [TablesController, ColumnsController, TasksController],
  providers: [TablesService, ColumnsService, TasksService],
  exports: [TablesService, ColumnsService, TasksService],
})
export class TablesModule {}