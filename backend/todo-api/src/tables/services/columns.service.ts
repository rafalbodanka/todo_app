import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column, Table, Task } from '../tables.model';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose'

import { MongoServerError } from 'mongodb';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel('column') private readonly columnModel: Model<Column>,
    @InjectModel('table') private readonly tableModel: Model<Table>,
    @InjectModel('task') private readonly taskModel: Model<Task>
    ) {}
  async insertColumn(title: string, tableId: string): Promise<Column> {
    try{
      // Creating new column
      const newColumn = new this.columnModel({
        title: title,
        tasks: [],
      });
      await newColumn.save();

      //find the table and update its column array with new column ID
      const table = await this.tableModel.findById(tableId);
      if (!table) {
        throw new Error("No table with given ID")
      }
      console.log(newColumn)
      table.columns.push(newColumn._id);
      await table.save();

      return newColumn;
      } catch (error) {
        console.log(error)
    //   if (error.name==='MongoServerError' && error.code === 11000) {
    //     throw new BadRequestException('Email already exists.')
    //   }
      throw error;
    }
  }

  async deleteColumn(columnId: string): Promise<boolean> {
    const column = await this.columnModel.findOne({ _id: columnId })

    // Return false if no column with given id
    if (!column) {
      return false;
    }
  
    // Delete the column
    await column.deleteOne();
  
    // Delete associated tasks
    await this.taskModel.deleteMany({ column: columnId }).exec();

    // Delete column from parent table array
    const parentTable = await this.tableModel.findOneAndUpdate(
      { columns: columnId },
      { $pull: { columns: columnId } },
      { new: true }
    );

    if (!parentTable) {
      throw new Error('Parent table not found');
    }
    return true;
  }
}