import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, Column } from '../tables.model';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as mongoose from 'mongoose';

import { MongoServerError } from 'mongodb';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('task') private readonly taskModel: Model<Task>,
    @InjectModel('column') private readonly columnModel: Model<Column>,
  ) {}
  async insertTask(title: string, columnId: string): Promise<Task> {
    try {
      // Creating new column
      const newTask = new this.taskModel({
        title: title,
        // complete status is false as default
        column: columnId,
      });
      await newTask.save();

      //find the table and update its column array with new column ID
      const column = await this.columnModel.findById(columnId);
      // new task is always at 0 index within the column's task array
      column.pendingTasks.unshift(newTask._id);
      await column.save();

      return newTask;
    } catch (error) {
      //   if (error.name==='MongoServerError' && error.code === 11000) {
      //     throw new BadRequestException('Email already exists.')
      //   }
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const task = await this.taskModel.findOne({ _id: taskId });

    // Return false if no task with given id
    if (!task) {
      return false;
    }
    // Get task's column id
    const columnId = task.column;

    let parentColumn: mongoose.Types.ObjectId;

    if (task.completed) {
      parentColumn = await this.columnModel.findOneAndUpdate(
        { completedTasks: taskId },
        { $pull: { completedTasks: taskId } },
        { new: true },
      );
    } else {
      parentColumn = await this.columnModel.findOneAndUpdate(
        { pendingTasks: taskId },
        { $pull: { pendingTasks: taskId } },
        { new: true },
      );
    }

    if (!parentColumn) {
      throw new Error('Parent table not found');
    }

    // Delete the task
    await task.deleteOne();

    return true;
  }

  async toggleTaskStatus(taskId: string): Promise<boolean> {
    const task = await this.taskModel.findOne({ _id: taskId });

    // Return false if no task with given id
    if (!task) {
      return false;
    }

    // Get task's column ID
    const columnId = task.column;

    // Find the column by its ID and populate its tasks
    const column = await this.columnModel.findOne({ _id: columnId.toString() });

    if (!column) {
      throw new Error('Parent table not found');
    }

    if (task.completed) {
      const taskIndex = column.completedTasks.findIndex(
        (task) => task._id.toString() === taskId,
      );
      const taskToMove = column.completedTasks.splice(taskIndex, 1)[0];
      column.pendingTasks.unshift(taskToMove);
    }

    if (!task.completed) {
      const taskIndex = column.pendingTasks.findIndex(
        (task) => task._id.toString() === taskId,
      );
      const taskToMove = column.pendingTasks.splice(taskIndex, 1)[0];
      column.completedTasks.unshift(taskToMove);
    }

    // Toggle the task's status
    task.completed = !task.completed;

    // Save the updated task and column
    await task.save();
    await column.save();
    return true;
  }
}
