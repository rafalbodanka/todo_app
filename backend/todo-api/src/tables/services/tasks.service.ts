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
        console.log(error)
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
}