import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table, Column, Task } from '../tables.model';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as mongoose from 'mongoose'

import { MongoServerError } from 'mongodb';

@Injectable()
export class TablesService {
  constructor(@InjectModel('table') private readonly tableModel: Model<Table>,
  @InjectModel('column') private readonly columnModel: Model<Column>,
  @InjectModel('task') private readonly taskModel: Model<Task>
  ) {}
  async insertTable(title: string, user: mongoose.Types.ObjectId): Promise<Table> {
    try{
      // Creating new set
      const newTable = new this.tableModel({
        title: title,
        columns: [],
        users: [user],
      });
      await newTable.save();
      return newTable;
      } catch (error) {
        console.log(error)
    //   if (error.name==='MongoServerError' && error.code === 11000) {
    //     throw new BadRequestException('Email already exists.')
    //   }
      throw error;
    }
  }

  async getUserTables(requestUser: mongoose.Types.ObjectId): Promise<Table[]> {
    console.log(requestUser)
    const userTable = await this.tableModel.find({users: requestUser})
        .populate({
            path: 'columns',
            populate: {
                path: 'tasks',
                model: 'task',
            },
            model: 'column'
        })
        .exec();
    return userTable;
  }

  async deleteTable(tableId: string, userId: string): Promise<boolean> {
    const table = await this.tableModel.findOne({ _id: tableId, users: userId })

    // Return false if no table with given id or user is unauthorized
    if (!table) {
      return false;
    }
  
    // Delete the table
    await table.deleteOne();
  
    // Delete associated columns and tasks
    await Promise.all(
      table.columns.map(async (columnId) => {
        await this.deleteColumn(columnId.toString());
      })
    );
  
    return true;
  }

  async deleteColumn(columnId: string): Promise<void> {
    // Delete the column
    await this.columnModel.deleteOne({ _id: columnId }).exec();

    // Delete associated tasks
    await this.taskModel.deleteMany({ column: columnId }).exec();
  }
}