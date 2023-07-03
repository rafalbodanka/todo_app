import * as mongoose from 'mongoose';
import { User } from '../users/users.model';

export const TableSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  columns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
    },
  ],
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      permission: {
        type: String,
        enum: ['admin', 'invite', 'none'],
        default: 'none',
      },
    },
  ],
});

export const ColumnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  pendingTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  completedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  showCompletedTasks: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false,
      default: '',
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
      required: true,
    },
    responsibleUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export interface Table extends Document {
  _id: string;
  title: string;
  columns: mongoose.Types.DocumentArray<Column>;
  users: Array<{
    user: mongoose.Types.ObjectId;
    permission: 'admin' | 'invite' | 'none';
  }>;
}

export interface Column extends Document {
  title: string;
  pendingTasks: mongoose.Types.DocumentArray<Task>;
  completedTasks: mongoose.Types.DocumentArray<Task>;
  showCompletedTasks: boolean;
}

export interface Task extends Document {
  title: string;
  notes: string;
  completed: boolean;
  column: mongoose.Types.ObjectId;
  responsibleUsers: mongoose.Types.ObjectId[];
}
