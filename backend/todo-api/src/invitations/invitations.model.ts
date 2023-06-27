import * as mongoose from 'mongoose';

export const InvitationSchema = new mongoose.Schema(
  {
    inviter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invitee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inviterEmail: {
      type: String,
      required: true,
    },
    inviteeEmail: {
      type: String,
      required: true,
    },
    inviterFirstName: {
      type: String,
      required: true,
    },
    inviterLastName: {
      type: String,
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true },
);

export interface Invitation extends mongoose.Document {
  _id: string;
  inviter: mongoose.Schema.Types.ObjectId;
  invitee: mongoose.Schema.Types.ObjectId;
  inviterEmail: string;
  inviteeEmail: string;
  inviterFirstName: string;
  inviterLastName: string;
  tableId: mongoose.Schema.Types.ObjectId;
  tableName: string;
  status: 'pending' | 'accepted';
  createdAt: Date;
  updatedAt: Date;
}
