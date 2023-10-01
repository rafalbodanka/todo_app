import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { UsersService } from './users.service';
import { SetsService } from 'src/sets/sets.service';

import * as mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly setsService: SetsService,
  ) {}
  //signup
  @Post('/signup')
  async addUser(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') userEmail: string,
    @Body('password') userPassword: string,
  ) {
    const result = await this.usersService.insertUser(
      firstName,
      lastName,
      userEmail,
      userPassword,
    );

    // Create a set for the new user
    await this.setsService.insertSet(result._id);

    return {
      msg: 'User successfully registered',
      userId: result._id,
      userEmail: result.email,
    };
  }
  //Post / Login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  login(@Request() req): any {
    return { user: req.user, msg: 'User logged in' };
  }

  //Get / protected
  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  getHello(@Request() req): string {
    return req.user;
  }
  //Get user data
  @UseGuards(AuthenticatedGuard)
  @Get('/user')
  async getUserData(@Request() req) {
    const result = await this.usersService.getUserData(req.user.email);
    return result;
  }

  //Update user data
  @UseGuards(AuthenticatedGuard)
  @Patch('/user/update')
  @HttpCode(200)
  async updateUserData(
    @Request() req,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') userEmail: string,
    @Body('level') level: string,
    @Body('userIconId') userIconId: number,
  ) {
    const userId: mongoose.Types.ObjectId = req.user.id;

    const result = await this.usersService.updateUserData(
      userId,
      firstName,
      lastName,
      userEmail,
      level,
      userIconId,
    );

    return { result, HttpCode: 200, msg: 'User edited succesfully' };
  }

  //Change password
  @UseGuards(AuthenticatedGuard)
  @Patch('/user/changepassword')
  @HttpCode(200)
  async changePassword(
    @Request() req,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmedNewPassword') confirmedNewPassword: string,
  ) {
    const userId: mongoose.Types.ObjectId = req.user.id;

    const result = await this.usersService.changePassword(
      userId,
      oldPassword,
      newPassword,
      confirmedNewPassword,
    );

    return { result, HttpCode: 200, msg: 'Password changed succesfully' };
  }

  //Get / logout
  @Get('/logout')
  @HttpCode(200)
  logout(@Request() req): any {
    req.session.destroy();
    return { HttpCode: 200, msg: 'The user session has ended' };
  }

  // testing query
  @Get('/all')
  async getUser() {
    const users = await this.usersService.getAllUser(); // Execute the query
    return users;
  }
}
