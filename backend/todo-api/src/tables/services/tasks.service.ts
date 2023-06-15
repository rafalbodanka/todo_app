import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, Column } from '../tables.model';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as mongoose from 'mongoose'

import { MongoServerError } from 'mongodb';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('task') private readonly taskModel: Model<Task>,
    @InjectModel('column') private readonly columnModel: Model<Column>,
    ) {}
  async insertTask(title: string, columnId: string): Promise<Task> {
    try{
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
      column.tasks.unshift(newTask._id);
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
    const task = await this.taskModel.findOne({ _id: taskId })

    // Return false if no task with given id
    if (!task) {
      return false;
    }
    // Get task's column id
    const columnId = task.column;
  
    // Delete the task
    await task.deleteOne();

    // Delete task from parent column array
    const parentColumn = await this.columnModel.findOneAndUpdate(
      { tasks: taskId },
      { $pull: { tasks: taskId } },
      { new: true }
    );

    if (!parentColumn) {
      throw new Error('Parent table not found');
    }
    return true;
  }

  async toggleTaskStatus(taskId: string): Promise<boolean> {
    const task = await this.taskModel.findOne ({ _id: taskId })

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

    // Find the index of the task within the column's tasks array
    const taskIndex = column.tasks.findIndex((t) => t._id.equals(task._id));

    // Return false if the task is not found in the column's tasks array
    if (taskIndex === -1) {
      return false;
    }
    
    // Move the task to the appropriate index based on its status
    const taskToMove = column.tasks.splice(taskIndex, 1)[0];
    if (taskToMove.completed) {
      const completedIndex = column.tasks.findIndex((task) => task.completed);
      column.tasks.splice(completedIndex !== -1 ? completedIndex : column.tasks.length, 0, taskToMove);
    } else {
      column.tasks.unshift(taskToMove);
    }
    
    // Toggle the task's status
    task.completed = !task.completed;

    // Save the updated task and column
    await task.save();
    await column.save();
    return true;
    }
  }
