import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import {
  validateName,
  validateEmail,
  validatePassword,
} from './signupValidators';
import { first } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}
  async insertUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    try {
      const userEmail = email.toLowerCase();

      // Validation
      validateEmail(email);
      validatePassword(password);
      validateName(firstName, lastName);

      // Password encryption
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);

      // Creating new user
      const newUser = new this.userModel({
        firstName: firstName,
        lastName: lastName,
        email: userEmail,
        password: hashedPassword,
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        throw new BadRequestException('Email already exists.');
      }
      throw error;
    }
  }

  //update user data
  async updateUserData(
    userId: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string,
    email: string,
    level: string,
    userIconId: number,
  ) {
    try {
      const userEmail = email.toLowerCase();

      // Validation
      validateEmail(email);
      validateName(firstName, lastName);

      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { _id: userId },
          {
            $set: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              level: level,
              userIconId: userIconId,
            },
          },
          { new: true },
        )
        .exec();

      if (!updatedUser) {
        throw new Error('User not found.');
      }

      await updatedUser.save();
      return updatedUser;
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        throw new BadRequestException('Email already exists.');
      }
      throw error;
    }
  }

  //change password
  async changePassword(
    userId: mongoose.Types.ObjectId,
    oldPassword: string,
    newPassword: string,
    confirmedNewPassword: string,
  ) {
    try {
      //Get user
      const user = (await this.userModel.findOne({ _id: userId })) as User;
      if (!user) {
        throw new Error('Could not find the user');
      }

      //Compare old password
      const passwordValid = await bcrypt.compare(oldPassword, user.password);
      if (!passwordValid) {
        throw new Error('Incorrect password');
      }

      // New password validation
      validatePassword(newPassword);

      if (newPassword !== confirmedNewPassword) {
        throw new Error("New passwords don't match.");
      }

      // New password encryption
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);

      // Update user's password
      user.password = hashedPassword;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  //get user for authentication
  async getUser(email: string) {
    const userEmail = email.toLowerCase();
    try {
      const user = (await this.userModel.findOne({ email: userEmail })) as User;

      return user;
    } catch (err) {
      throw new Error('Something went wrong.');
    }
  }

  //get user data for client
  async getUserData(email: string) {
    const userEmail = email.toLowerCase();
    try {
      const user = (await this.userModel.findOne({ email: userEmail })) as User;
      return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        level: user.level,
        iconId: user.userIconId,
      };
    } catch (err) {
      throw new Error('Something went wrong.');
    }
  }

  //testing query
  async getAllUser() {
    const user = await this.userModel.find();
    return user;
  }
}
