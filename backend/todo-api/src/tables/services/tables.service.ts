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
        users: [{ user: user, permission: 'admin' }],
      });
      await newTable.save();
      return newTable;
    } catch (error) {
      throw error;
    }
  }

  async getUserTables(requestUser: mongoose.Types.ObjectId): Promise<Table[]> {
    const userTable = await this.tableModel
      .find({ 'users.user': requestUser })
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
        { $pull: { users: { user: memberId } } },
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
        { $addToSet: { users: { user: userId, permission: 'none' } } },
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
        path: 'users.user',
        model: 'user',
        select: '-password -id', // Exclude the 'password' field
      })
      .select('users')
      .exec();
    return userMembers?.users; // Return only the 'users' field
  }

  async changeMemberPermission(
    tableId: string,
    userId: string,
    updaterId: string,
    newPermission: string,
  ): Promise<any> {
    try {
      const table = await this.tableModel.findById(tableId);

      if (!table) {
        throw new Error('Table not found');
      }

      // Check if the user's who's updating permission is "admin" or "invite"
      const updaterPermission = table.users.find(
        (user) => user.user.toString() === updaterId,
      );

      if (!updaterPermission) {
        throw new Error('Permission not found');
      }

      if (updaterPermission.permission !== 'admin') {
        throw new Error('Inviter does not have sufficient permission');
      }

      // Find the index of the user in the users array
      const memberIndex = table.users.findIndex((user) => {
        return user.user._id.toString() === userId;
      });

      if (memberIndex !== -1) {
        // Update the user's permission
        table.users[memberIndex].permission = newPermission as
          | 'none'
          | 'admin'
          | 'invite';

        // Save the updated table
        await table.save();

        return `User ${userId} permission updated to ${newPermission}`;
      } else {
        throw new Error('User not found in the table');
      }
    } catch (err) {
      throw { message: err.message };
    }
  }

  //Helper function for deleting table with its items
  async deleteColumn(columnId: string): Promise<void> {
    // Delete the column
    await this.columnModel.deleteOne({ _id: columnId }).exec();

    // Delete associated tasks
    await this.taskModel.deleteMany({ column: columnId }).exec();
  }
}
