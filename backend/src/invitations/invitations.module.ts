import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationsController } from './invitations.controller';
import { TableSchema } from 'src/tables/tables.model';
import { UserSchema } from 'src/users/users.model';
import { InvitationSchema } from './invitations.model';
import { InvitationsService } from './invitations.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'invitation', schema: InvitationSchema },
      { name: 'user', schema: UserSchema },
      { name: 'table', schema: TableSchema },
    ]),
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
