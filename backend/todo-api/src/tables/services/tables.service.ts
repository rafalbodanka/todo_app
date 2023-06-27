import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table, Column, Task } from '../tables.model';
import * as mongoose from 'mongoose';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel('table') private readonly tableModel: Model<Table>,
    @InjectModel('column') private readonly columnModel: Model<Column>,
    @InjectModel('task') private readonly taskModel: Model<Task>,
  ) {}
  async insertTable(
    title: string,
    user: mongoose.Types.ObjectId,
  ): Promise<Table> {
    try {
      // Creating new set
      const newTable = new this.tableModel({
        title: title,
        columns: [],
        users: [user],
      });
      await newTable.save();
      return newTable;
    } catch (error) {
      throw error;
    }
  }

  async getUserTables(requestUser: mongoose.Types.ObjectId): Promise<Table[]> {
    const userTable = await this.tableModel
      .find({ users: requestUser })
      .populate({
        path: 'columns',
        populate: [
          { path: 'pendingTasks', model: 'task' },
          { path: 'completedTasks', model: 'task' },
        ],
        model: 'column',
      })
      .exec();
    return userTable;
  }

  async removeMember(tableId: string, memberId: string): Promise<boolean> {
    try {
      const table = await this.tableModel.findByIdAndUpdate(
        tableId,
        { $pull: { users: memberId } },
        { new: true },
      );

      // Return false if no table with given id or user is unauthorized
      if (!table) {
        return false;
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async renameTable(
    tableId: string,
    userId: string,
    newTitle: string,
  ): Promise<boolean> {
    const table = await this.tableModel.findOneAndUpdate(
      {
        _id: tableId,
        users: userId,
      },
      {
        title: newTitle,
      },
    );

    // Return false if no table with given id or user is unauthorized
    if (!table) {
      return false;
    }
    return true;
  }

  async deleteTable(tableId: string, userId: string): Promise<boolean> {
    const table = await this.tableModel.findOne({
      _id: tableId,
      users: userId,
    });

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
      }),
    );

    return true;
  }

  //testing tables
  async getAllTables(): Promise<Table[]> {
    try {
      const tables = await this.tableModel.find().exec();
      return tables;
    } catch (error) {
      throw error;
    }
  }

  async insertUser(userId: string, tableId: string): Promise<boolean> {
    try {
      const table = await this.tableModel.findByIdAndUpdate(
        tableId,
        { $addToSet: { users: userId } },
        { new: true },
      );

      // Return false if no table with given id or user is unauthorized
      if (!table) {
        return false;
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getTableMembers(tableId: string): Promise<any> {
    const userMembers = await this.tableModel
      .findOne({ _id: tableId })
      .populate({
        path: 'users',
        model: 'user',
        select: '-password', // Exclude the 'password' field
      })
      .select('users')
      .exec();
    return userMembers?.users; // Return only the 'users' field
  }

  //Helper function for deleting table with its items
  async deleteColumn(columnId: string): Promise<void> {
    // Delete the column
    await this.columnModel.deleteOne({ _id: columnId }).exec();

    // Delete associated tasks
    await this.taskModel.deleteMany({ column: columnId }).exec();
  }
}
