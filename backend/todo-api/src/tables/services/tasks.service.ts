import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, Column } from '../tables.model';
import * as mongoose from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('task') private readonly taskModel: Model<Task>,
    @InjectModel('column') private readonly columnModel: Model<Column>,
  ) {}
  async insertTask(title: string, taskId: string): Promise<Task> {
    try {
      // Creating new column
      const newTask = new this.taskModel({
        title: title,
        // complete status is false by default
        column: taskId,
      });
      await newTask.save();

      // find the table and update its column array with new column ID
      const column = await this.columnModel.findById(taskId);
      // new task is always at index 0 within the column's task array
      column.pendingTasks.unshift(newTask._id);
      await column.save();

      return newTask;
    } catch (error) {
      throw error;
    }
  }

  async renameTask(taskId: string, newTitle: string): Promise<boolean> {
    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        title: newTitle,
      },
    );

    // Return false if no task with given id or user is unauthorized
    if (!task) {
      return false;
    }
    return true;
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

    // moving completed task back to pending tasks array
    if (task.completed) {
      const taskIndex = column.completedTasks.findIndex(
        (completedTask) => completedTask._id.toString() === taskId,
      );
      const taskToMove = column.completedTasks.splice(taskIndex, 1)[0];
      column.pendingTasks.unshift(taskToMove);
    }

    // moving pending task to completed tasks array
    if (!task.completed) {
      const taskIndex = column.pendingTasks.findIndex(
        (pendingTask) => pendingTask._id.toString() === taskId,
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
