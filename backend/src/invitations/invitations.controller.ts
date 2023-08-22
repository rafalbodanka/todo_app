import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Param,
  UseGuards,
  Request,
  Delete,
  Res,
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
    @Res() res,
  ) {
    try {
      const result = await this.invitationsService.inviteUser(
        inviteeEmail,
        inviterId,
        tableId,
        tableName,
      );

      return res.status(HttpStatus.OK).json({
        message: 'User invited successfully.',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message
      });
    }
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
    };
  }

  //Cancel Invitation
  @UseGuards(AuthenticatedGuard)
  @Delete('/:id/cancel')
  async cancelInvitation(@Param('id') invitationId: string) {
    const result = await this.invitationsService.cancelInvitation(invitationId);

    return result
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
