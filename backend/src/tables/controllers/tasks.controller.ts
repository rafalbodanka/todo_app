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
  Put,
  Patch,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { TasksService } from '../services/tasks.service';
import { Task } from '../tables.model';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  //create column
  @UseGuards(AuthenticatedGuard)
  @Post('/create')
  async createTask(
    // we pass only title, because complete status is false by default
    @Body('title') title: string,
    @Body('columnId') columnId: string,
    @Body('tableId') tableId: string,
  ) {
    const result = await this.tasksService.insertTask(title, columnId, tableId);

    return {
      msg: 'Task successfully created',
      data: result,
    };
  }

  //rename task
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/name')
  async renameTask(
    @Param('id') id: string,
    @Request() req,
    @Body('newTitle') newTitle: string,
    @Body('tableId') tableId: string,
    @Res() res,
  ) {
    const userId: mongoose.Types.ObjectId = req.user.id;
    const result = await this.tasksService.renameTask(id, newTitle, tableId);

    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id/delete')
  async deleteTask(@Param('id') id: string, @Res() res, @Body('tableId') tableId: string) {
    const result = await this.tasksService.deleteTask(id, tableId);

    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id/status')
  async toggleTaskStatus(
    @Param('id') id: string,
    @Body('taskCompleted') taskCompleted: boolean,
    @Body('taskColumn') taskColumn: string,
    @Body('currentTableId') currentTableId: string,
    @Res() res,
  ) {
    const result = await this.tasksService.toggleTaskStatus(
      id,
      taskCompleted,
      taskColumn,
      currentTableId,
    );

    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id/notes')
  async updateNotes(
    @Param('id') id: string,
    @Body('newNotes') newNotes: string,
    @Body('tableId') tableId: string,
    @Res() res,
  ) {
    const result = await this.tasksService.updateNotes(id, newNotes, tableId);

    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id/responsible-users')
  async getResponsibleUsers(
    @Param('id') id: string,
    @Body('currentTableId') tableId: string,
    @Res() res,
  ) {
    try {
      const result = await this.tasksService.getResponsibleUsers(id, tableId);

      return res.status(HttpStatus.OK).json({
        message: 'Responsible users fetched successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id/assign-user')
  async assignUser(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Res() res,
  ) {
    try {
      const result = await this.tasksService.assignUser(id, userId);

      return res.status(HttpStatus.OK).json({
        message: 'User assigned successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id/remove-user')
  async removeUser(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Res() res,
  ) {
    try {
      const result = await this.tasksService.removeUser(id, userId);

      return res.status(HttpStatus.OK).json({
        message: 'User removed successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/:id/estimation')
  async toggleEstimation(
    @Param('id') id: string,
    @Body('isEstimated') isEstimated: boolean,
    @Res() res,
  ) {
    const result = await this.tasksService.toggleEstimation(id, isEstimated);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Task estimation status changed successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
      });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/:id/difficulty')
  async updateDifficulty(
    @Param('id') id: string,
    @Body('difficulty') difficulty: number,
    @Res() res,
  ) {
    const result = await this.tasksService.updateDifficulty(id, difficulty);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Task difficulty updated successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
      });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/:id/date-range')
  async setDateRange(
    @Param('id') id: string,
    @Body('startDate') startDate: Date,
    @Body('endDate') endDate: Date,
    @Res() res,
  ) {
    const result = await this.tasksService.setDateRange(id, startDate, endDate);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Task date range updated successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
      });
    }
  }

  //retrieve task data
  @UseGuards(AuthenticatedGuard)
  @Get('/:id')
  async getTaskData(
    @Param('id') id: string,
    @Res() res,
  ) {
    const result = await this.tasksService.getTaskData(id);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Task retrieved succesfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
      });
    }
  }

  //update task data
  @UseGuards(AuthenticatedGuard)
  @Patch('/:id/update')
  async updateTaskData(
    @Param('id') id: string,
    @Body('task') task: Task,
    @Body('currentTableId') currentTableId: string,
    @Res() res,
  ) {
    const result = await this.tasksService.updateTaskData(id, task, currentTableId);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Task updated succesfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
      });
    }
  }
}
