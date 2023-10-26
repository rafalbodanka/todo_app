import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation } from './invitations.model';
import { User } from 'src/users/users.model';
import { Table } from 'src/tables/tables.model';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { TablesService } from 'src/tables/services/tables.service';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel('invitation')
    private readonly invitationModel: Model<Invitation>,
    @InjectModel('user')
    private readonly userModel: Model<User>,
    @InjectModel('table')
    private readonly tableModel: Model<Table>,
    @Inject(TablesService)
    private readonly TablesService: TablesService,
  ) {}
  async inviteUser(
    inviteeEmail: string,
    inviterId: string,
    tableId: string,
    tableName: string,
  ): Promise<Invitation> {
    const inviterObjId = new mongoose.Types.ObjectId(inviterId);
    const tableObjId = new mongoose.Types.ObjectId(tableId);
    try {
      //getting inviter's data
      const invitersData = await this.userModel.findById(inviterObjId).exec();
      if (!invitersData) {
        throw new Error('Inviter not found');
      }

      // Check if the inviter's permission is "admin" or "invite"
      const inviterPermission = await this.tableModel
        .findOne({ _id: tableObjId, 'users.user': inviterObjId })
        .exec();

      if (!inviterPermission || !inviterPermission.users[0]) {
        throw new Error('Permission not found');
      }

      const inviterUser = inviterPermission.users[0];
      if (
        inviterUser.permission !== 'admin' &&
        inviterUser.permission !== 'invite'
      ) {
        throw new Error('Inviter does not have sufficient permission');
      }

      //getting invitee's data
      const inviteesData = await this.userModel
        .findOne({ email: inviteeEmail.toLowerCase() })
        .exec();
      if (!inviteesData) {
        throw new Error('Invitee not found');
      }

      //check if user is already in the table
      const existingMember = await this.tableModel
        .findOne({ _id: tableObjId, 'users.user': inviteesData._id })
        .exec();

      if (existingMember) {
        throw new Error('User is already here.');
      }

      // Check if the same invitation already exists
      const checkInvitation = await this.invitationModel
        .findOne({
          inviter: inviterObjId,
          invitee: inviteesData._id,
          tableId: tableObjId,
        })
        .exec();

      if (checkInvitation) {
        throw new Error('Invitation already exists.');
      }

      // Creating new invitation
      const newInvitation = new this.invitationModel({
        inviter: inviterObjId,
        invitee: inviteesData._id,
        inviterEmail: invitersData.email,
        inviteeEmail: inviteeEmail,
        inviterFirstName: invitersData.firstName,
        inviterLastName: invitersData.lastName,
        tableId: tableObjId,
        tableName: tableName,
      });
      await newInvitation.save();
      return newInvitation;
    } catch (error) {
      throw error;
    }
  }

  //Accept invitation
  async acceptInvitation(invitationId: string, userId: string): Promise<{receivedInvitations: Invitation[], userTables: Table[]}> {
    try {
      // Find the invitation
      const invitation = await this.invitationModel
        .findById(invitationId)
        .exec();

      if (!invitation) {
        throw new Error('Invitation not found')
      };

      // Find the invited user
      const invitedUser = await this.userModel
        .findById(invitation.invitee)
        .exec();

      if (!invitedUser) {
        throw new Error('Invited user not found');
      }

      // Add the invited user to the table's users array
      const table = await this.tableModel.findById(invitation.tableId).exec();

      if (!table) {
        throw new Error('Table not found');
      }

      table.users.push({
        user: new mongoose.Types.ObjectId(invitedUser._id),
        permission: 'none',
      });
      await table.save();

      // Find and delete the invitation - temporary
      // later we will store the history of invitations
      const deletedInvitation = await this.invitationModel.findOneAndDelete({
        _id: invitationId,
      });

      if (!deletedInvitation) {
        throw new Error('Invitation not found')
      }

      const receivedInvitations = await this.getInviteesInvitations(userId)
      const userTables = await this.TablesService.getUserTables(new mongoose.Types.ObjectId(userId))

      return {receivedInvitations, userTables};
    } catch (error) {
      throw error;
    }
  }

  async getInvitersInvitations(requestUser: string): Promise<Invitation[]> {
    try {
      const requestUserId = new mongoose.Types.ObjectId(requestUser);
      const userInvitations = await this.invitationModel
        .find({ inviter: requestUserId })
        .exec();
      return userInvitations;
    } catch (err) {
      throw err;
    }
  }

  //get invitee's invitations
  async getInviteesInvitations(requestUser: string): Promise<Invitation[]> {
    try {
      const requestUserId = new mongoose.Types.ObjectId(requestUser);
      const userInvitations = await this.invitationModel
        .find({ invitee: requestUserId })
        .exec();
      return userInvitations;
    } catch (err) {
      throw err;
    }
  }

  // we are not storing cancelled invitations
  // async cancelInvitation/rejectInvitation - the same behaviour at the moment
  async cancelInvitation(invitationId: string, userId: string, type: 'cancel' | 'reject'): Promise<Invitation[]> {
    try {
      // Delete the invitation entry from the database
      const deletedInvitation = await this.invitationModel.findByIdAndDelete(
        invitationId,
      );

      if (!deletedInvitation) {
        throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
    if (type === 'cancel') {
      const receivedInvitations = await this.getInvitersInvitations(userId)
      return receivedInvitations;
      // type "reject"
    } else {
      const receivedInvitations = await this.getInviteesInvitations(userId)
      return receivedInvitations;
    }
  }
}
