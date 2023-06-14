import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, Column } from '../tables.model';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
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
}