import * as mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      default: '',
    },
    lastName: {
      type: String,
      required: true,
      default: '',
    },
    level: {
      type: String,
    },
    userIconId: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export interface User extends mongoose.Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  level?: string;
  userIconId: number;
}
