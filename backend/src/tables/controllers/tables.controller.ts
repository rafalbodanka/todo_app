import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Param,
  Res,
  Req,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { TablesService } from '../services/tables.service';
import { get } from 'http';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}
  //create table
  @UseGuards(AuthenticatedGuard)
  @Post('/create')
  async createTable(@Body('title') title: string, @Request() req, @Res() res) {
    const userId: mongoose.Types.ObjectId = req.user.id;
    const result = await this.tablesService.insertTable(title, userId);

    return res.status(HttpStatus.CREATED).json({
      message: 'Table created successfully',
      data: result,
    });
  }

  //Get all user's tables
  @UseGuards(AuthenticatedGuard)
  @Get('/tables')
  async getUserTables(@Request() req): Promise<any> {
    const userId: mongoose.Types.ObjectId = req.user.id;
    const userTables = await this.tablesService.getUserTables(userId);
    return userTables;
  }

  //rename table
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/name')
  async renameTable(
    @Param('id') id: string,
    @Request() req,
    @Body('newTitle') newTitle: string,
    @Res() res,
  ) {
    const userId: mongoose.Types.ObjectId = req.user.id;
    const result = await this.tablesService.renameTable(
      id,
      userId.toString(),
      newTitle,
    );

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Table renamed successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Table not found',
      });
    }
  }

  //delete table
  @UseGuards(AuthenticatedGuard)
  @Post('/delete/:id')
  async deleteTable(@Param('id') id: string, @Request() req, @Res() res) {
    const userId: mongoose.Types.ObjectId = req.user.id;
    const result = await this.tablesService.deleteTable(id);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Table deleted successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Table not found',
      });
    }
  }

  //remove member
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/remove-member')
  async removeMember(
    @Param('id') id: string,
    @Body('memberId') memberId: string,
    @Request() req,
    @Res() res,
  ) {
    const result = await this.tablesService.removeMember(id, memberId);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Member removed successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Member not found',
      });
    }
  }

  //get table members
  @UseGuards(AuthenticatedGuard)
  @Get('/:id/members')
  async getTableMembers(@Param('id') id: string, @Request() req, @Res() res) {
    const result = await this.tablesService.getTableMembers(id);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Table members fetched successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Table not found',
      });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/users')
  async insertUser(
    @Body('userId') userId: string,
    @Body('tableId') tableId: string,
    @Res() res,
  ) {
    try {
      const result = await this.tablesService.insertUser(userId, tableId);
      return res.status(HttpStatus.OK).json({
        message: 'User inserted successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to insert user',
        error: error.message,
      });
    }
  }

  //update permissions
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/permissions')
  async changeMemberPermission(
    @Param('id') tableId: string,
    @Body('userId') userId: string,
    @Body('newPermission') newPermission: string,
    @Req() req,
    @Res() res,
  ) {
    const updaterId = req.user.id;
    try {
      const result = await this.tablesService.changeMemberPermission(
        tableId,
        userId,
        updaterId,
        newPermission,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Permissions changed successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Failed to change permissions',
        error: error.message,
      });
    }
  }

  //testing tables
  @Get('/alltables')
  async getAllTables(@Res() res) {
    try {
      const tables = await this.tablesService.getAllTables();
      return res.status(HttpStatus.OK).json({
        message: 'Tables retrieved successfully',
        data: tables,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to change permissions',
        error: error.message || 'An error occurred',
      });
    }
  }
}
