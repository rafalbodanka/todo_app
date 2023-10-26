import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TablesController } from './controllers/tables.controller';
import { ColumnsController } from './controllers/columns.controller';
import { TasksController } from './controllers/tasks.controller';
import { TableSchema, ColumnSchema, TaskSchema } from './tables.model';
import { TablesService } from './services/tables.service';
import { ColumnsService } from './services/columns.service';
import { TasksService } from './services/tasks.service';
import { InvitationsService } from 'src/invitations/invitations.service';
import { InvitationSchema } from 'src/invitations/invitations.model';
import { UserSchema } from 'src/users/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'table', schema: TableSchema },
      { name: 'column', schema: ColumnSchema },
      { name: 'task', schema: TaskSchema },
      { name: 'invitation', schema: InvitationSchema },
      { name: 'user', schema: UserSchema },
    ]),
  ],
  controllers: [TablesController, ColumnsController, TasksController],
  providers: [TablesService, ColumnsService, TasksService, InvitationsService],
  exports: [TablesService, ColumnsService, TasksService],
})
export class TablesModule {}
