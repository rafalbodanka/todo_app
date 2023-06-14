import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';

import { validateEmail, validatePassword} from './signupValidators'
import { MongoServerError } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}
  async insertUser(email: string, password: string) {
    try{
      const userEmail = email.toLowerCase();
  
      // Validation
      if (!userEmail || !password) {
        throw new BadRequestException('Email and password are required.');
      }
  
      if (!validateEmail(userEmail)) {
        throw new BadRequestException('Invalid email address.');
      }
  
      if (userEmail.length < 5 || userEmail.length > 100) {
        throw new BadRequestException('Email must be between 5 and 100 characters.');
      }
  
      if (!validatePassword(password)) {
        throw new BadRequestException('Password must contain at least one special character, capitalized letter and a number.');
      }
  
      if (password.length < 8 || password.length > 30) {
        console.log(userEmail, password)
        throw new BadRequestException('Password must be between 8 and 30 characters.');
      }
  
      // Password encryption
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  
      // Creating new user
      const newUser = new this.userModel({
        email: userEmail,
        password: hashedPassword,
      });
      await newUser.save();
      return newUser;
      } catch (error) {
        console.log(error)
      if (error.name==='MongoServerError' && error.code === 11000) {
        throw new BadRequestException('Email already exists.')
      }
      throw error;
    }
  }
  async getUser(email: string) {
    const userEmail = email.toLowerCase();
    try {
      const user = await this.userModel.findOne({ email: userEmail });
      return user;
    } catch (err) {
      throw new Error('dupka')
    }
  }

  //testing query
  async getAllUser() {
    const user = await this.userModel.find();
    return user;
  }
}