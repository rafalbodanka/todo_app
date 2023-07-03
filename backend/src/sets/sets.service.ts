import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Set } from './sets.model';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as mongoose from 'mongoose'

import { MongoServerError } from 'mongodb';

@Injectable()
export class SetsService {
  constructor(@InjectModel('set') private readonly setModel: Model<Set>) {}
  async insertSet(user: mongoose.Types.ObjectId | string): Promise<Set> {
    try{
      // Creating new set
      const newSet = new this.setModel({
        tables: [],
        user: user,
      });
      await newSet.save();
      return newSet;
      } catch (error) {
        console.log(error)
    //   if (error.name==='MongoServerError' && error.code === 11000) {
    //     throw new BadRequestException('Email already exists.')
    //   }
      throw error;
    }
  }

  async getUserSet(requestUser: mongoose.Types.ObjectId): Promise<Set[]> {
    const userSet = await this.setModel.find({user: requestUser});
    return userSet;
  }
}