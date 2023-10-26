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
    @Res() res,
  ) {
    try {
      const result = await this.invitationsService.acceptInvitation(invitationId, userId);
      return res.status(HttpStatus.OK).json({
        message: 'Invitation accepted succesfully',
        data: result,
    })
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message
      });
    }
  }

  //Cancel Invitation
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/cancel')
  async cancelInvitation(
    @Param('id') invitationId: string,
    @Body('type') type: 'cancel' | 'reject',
    @Request() req,
    @Res() res,
    ) {
    const userId = req.user.id 
    try {
      const result = await this.invitationsService.cancelInvitation(invitationId, userId, type);
      return res.status(HttpStatus.OK).json({
        message: 'Invitation cancelled succesfully',
        data: result,
    })
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message
      });
    }
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
