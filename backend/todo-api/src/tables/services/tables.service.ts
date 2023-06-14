import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from '../tables.model';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose'

import { MongoServerError } from 'mongodb';

@Injectable()
export class TablesService {
  constructor(@InjectModel('table') private readonly setModel: Model<Table>,) {}
  async insertTable(title: string, user: mongoose.Types.ObjectId): Promise<Table> {
    try{
      // Creating new set
      const newTable = new this.setModel({
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
    const userTable = await this.setModel.find({users: requestUser})
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
}