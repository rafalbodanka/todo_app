import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation } from './invitations.model';
import { User } from 'src/users/users.model';
import { Table } from 'src/tables/tables.model';

import * as mongoose from 'mongoose';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel('invitation')
    private readonly invitationModel: Model<Invitation>,
    @InjectModel('user')
    private readonly userModel: Model<User>,
    @InjectModel('table')
    private readonly tableModel: Model<Table>,
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
        console.log('Inviter not found:', inviterObjId);
        throw new Error('Inviter not found');
      }
      //getting invitee's data
      const inviteesData = await this.userModel
        .findOne({ email: inviteeEmail.toLowerCase() })
        .exec();
      if (!inviteesData) {
        throw new Error('Invitee not found');
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
  async acceptInvitation(invitationId: string, userId: string): Promise<Table> {
    try {
      // Find the invitation
      const invitation = await this.invitationModel
        .findById(invitationId)
        .exec();

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      // Find the invited user
      const invitedUser = await this.userModel
        .findById(invitation.invitee)
        .exec();

      if (!invitedUser) {
        throw new Error('Invited user not found');
      }

      // Update the invitation status
      // invitation.status = 'accepted';
      // await invitation.save();

      // Add the invited user to the table's users array
      const table = await this.tableModel.findById(invitation.tableId).exec();

      if (!table) {
        throw new Error('Table not found');
      }

      table.users.push(invitedUser._id);
      await table.save();

      // Find and delete the invitation - temporary
      // later we will store the history of invitations
      const deletedInvitation = await this.invitationModel.findOneAndDelete({
        _id: invitationId,
      });

      if (!deletedInvitation) {
        throw new Error('Invitation not found');
      }

      return table;
    } catch (error) {
      throw error;
    }
  }

  async getInvitersInvitations(requestUser: string): Promise<Invitation[]> {
    try {
      const requestUserId = new mongoose.Types.ObjectId(requestUser);
      console.log('Request User ID:', requestUserId);
      const userInvitations = await this.invitationModel
        .find({ inviter: requestUserId })
        .exec();
      console.log('User sent invitations:', userInvitations);
      return userInvitations;
    } catch (err) {
      throw err;
    }
  }

  //get invitee's invitations
  async getInviteesInvitations(requestUser: string): Promise<Invitation[]> {
    try {
      const requestUserId = new mongoose.Types.ObjectId(requestUser);
      console.log('Request User ID:', requestUserId);
      const userInvitations = await this.invitationModel
        .find({ invitee: requestUserId })
        .exec();
      console.log('User received invitations:', userInvitations);
      return userInvitations;
    } catch (err) {
      throw err;
    }
  }

  // we are not storing cancelled invitations
  // async cancelInvitation/rejectInvitation - the same behaviour at the moment
  async cancelInvitation(invitationId: string) {
    try {
      // Delete the invitation entry from the database
      const deletedInvitation = await this.invitationModel.findByIdAndDelete(
        invitationId,
      );

      if (!deletedInvitation) {
        throw new Error('Invitation not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
