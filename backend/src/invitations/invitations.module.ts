import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationsController } from './invitations.controller';
import { TableSchema } from 'src/tables/tables.model';
import { ColumnSchema } from 'src/tables/tables.model';
import { TaskSchema } from 'src/tables/tables.model';
import { UserSchema } from 'src/users/users.model';
import { InvitationSchema } from './invitations.model';
import { InvitationsService } from './invitations.service';
import { UsersService } from 'src/users/users.service';
import { TablesService } from 'src/tables/services/tables.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'invitation', schema: InvitationSchema },
      { name: 'user', schema: UserSchema },
      { name: 'table', schema: TableSchema },
      { name: 'column', schema: ColumnSchema },
      { name: 'task', schema: TaskSchema },
    ]),
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService, TablesService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
