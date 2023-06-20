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
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { TasksService } from '../services/tasks.service';

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
  ) {
    const result = await this.tasksService.insertTask(title, columnId);

    return {
      msg: 'Task successfully created',
      title: result.title,
    };
  }

  //rename task
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/name')
  async renameTable(
    @Param('id') id: string,
    @Request() req,
    @Body('newTitle') newTitle: string,
    @Res() res,
  ) {
    const userId: mongoose.Types.ObjectId = req.user.id;
    const result = await this.tasksService.renameTask(id, newTitle);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Task renamed successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
      });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id/delete')
  async deleteTask(@Param('id') id: string, @Res() res) {
    const result = await this.tasksService.deleteTask(id);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Task deleted successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
      });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id/status')
  async toggleTaskStatus(@Param('id') id: string, @Res() res) {
    const result = await this.tasksService.toggleTaskStatus(id);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Task status changed successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Task not found',
      });
    }
  }
}
