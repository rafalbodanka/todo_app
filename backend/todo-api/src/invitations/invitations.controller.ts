import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  //create new invitation
  @UseGuards(AuthenticatedGuard)
  @Post('/create')
  async inviteUser(
    @Body('inviteeEmail') inviteeEmail: string,
    @Body('inviterId') inviterId: string,
    @Body('tableId') tableId: string,
    @Body('tableName') tableName: string,
  ) {
    const result = await this.invitationsService.inviteUser(
      inviteeEmail,
      inviterId,
      tableId,
      tableName,
    );

    return {
      result,
      msg: 'User invited successfully.',
    };
  }

  //Accept invitation
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/accept')
  async acceptInvitation(
    @Param('id') invitationId: string,
    @Body('userId') userId: string,
  ) {
    const result = await this.invitationsService.acceptInvitation(
      invitationId,
      userId,
    );

    return {
      result,
      msg: 'Invitation accepted successfully.',
    };
  }

  //Cancel Invitation
  @UseGuards(AuthenticatedGuard)
  @Delete('/:id/cancel')
  async cancelInvitation(@Param('id') invitationId: string) {
    const result = await this.invitationsService.cancelInvitation(invitationId);

    return {
      result,
      msg: 'Invitation cancelled successfully.',
    };
  }

  //Get inviter's invitations
  @UseGuards(AuthenticatedGuard)
  @Get('/get/inviter')
  async getInvitersInvitations(@Request() req) {
    const userId = req.user.id;
    const result = await this.invitationsService.getInvitersInvitations(userId);
    return result;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/get/invitee')
  async getInviteesInvitations(@Request() req) {
    const userId = req.user.id;
    const result = await this.invitationsService.getInviteesInvitations(userId);
    return result;
  }
}
