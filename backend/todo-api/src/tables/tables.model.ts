import * as mongoose from 'mongoose';
import { User } from '../users/users.model'

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
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
});

export const ColumnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tasks: [
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

export const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
});

export interface Table extends Document {
	_id: string;
  title: string;
  columns: mongoose.Types.DocumentArray<Column>;
  users: mongoose.Types.Array<User['_id']>;
}

export interface Column extends Document {
  title: string;
  tasks: mongoose.Types.DocumentArray<Task>;
  showCompletedTasks: boolean;
}

export interface Task extends Document {
  title: string;
  completed: boolean;
  column: mongoose.Types.ObjectId;
}

