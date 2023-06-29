import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Res,
  Request,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ColumnsService } from '../services/columns.service';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}
  //create column
  @UseGuards(AuthenticatedGuard)
  @Post('/create')
  async createColumn(
    @Body('title') title: string,
    @Body('tableId') tableId: string,
  ) {
    const result = await this.columnsService.insertColumn(title, tableId);

    return {
      msg: 'Column created successfully',
      title: result.title,
    };
  }

  //rename column
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/name')
  async renameTable(
    @Param('id') id: string,
    @Request() req,
    @Body('newTitle') newTitle: string,
    @Res() res,
  ) {
    const userId: mongoose.Types.ObjectId = req.user.id;
    const result = await this.columnsService.renameColumn(id, newTitle);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Column renamed successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Column not found',
      });
    }
  }

  //delete column
  @UseGuards(AuthenticatedGuard)
  @Post('/delete/:id')
  async deleteColumn(@Param('id') id: string, @Res() res) {
    const result = await this.columnsService.deleteColumn(id);

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Column deleted successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Column not found',
      });
    }
  }

  //toggle show completed tasks
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/status')
  async toggleCompletedTaskStatus(
    @Param('id') id: string,
    @Body('showCompletedTasks') showCompletedTasks: boolean,
    @Res() res,
  ) {
    const result = await this.columnsService.toggleCompletedTaskStatus(
      id,
      showCompletedTasks,
    );

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Column show completed tasks status changed successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Column not found',
      });
    }
  }

  //drag and drop tasks
  @UseGuards(AuthenticatedGuard)
  @Post('/:id/ids')
  async moveTaskWithinColumn(
    @Param('id') id: string,
    @Body('movedTaskId') movedTaskId: string,
    @Body('sourceColumn') sourceColumn: string,
    @Body('destinationColumnId') destinationColumnId: string,
    @Body('destinationIndex') destinationIndex: string,
    @Body('completed') completed: boolean,
    @Body('changeStatus') changeStatus: boolean,
    @Res() res,
  ) {
    const result = await this.columnsService.moveTaskWithinColumn(
      id,
      movedTaskId,
      destinationColumnId,
      destinationIndex,
      completed,
      changeStatus,
    );

    if (result) {
      return res.status(HttpStatus.OK).json({
        message: 'Column moved successfully',
        data: result,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Column not found',
      });
    }
  }
}
