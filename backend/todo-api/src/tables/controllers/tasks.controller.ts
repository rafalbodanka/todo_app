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
import * as mongoose from "mongoose"
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
		const result = await this.tasksService.insertTask(
            title,
			columnId,
		);

		return {
			msg: 'Task successfully created',
            title: result.title,
		};
	}

	@UseGuards(AuthenticatedGuard)
	@Post('/delete/:id')
	async deleteTask(
		@Param('id') id: string,
		@Res() res,
	) {
		const result = await this.tasksService.deleteTask(
			id,
			);

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

	//Get all table's columns
	// @UseGuards(AuthenticatedGuard)
	// @Get('/columns')
	// async getTableColumns(@Request() req): Promise<any> {
    //     @Body('column_id') columnId: string,
	// 	const TableId: mongoose.Types.ObjectId = req.user._id;
	// 	const TableColumns = await this.columnsService.getTableColumns(columnId);
	// 	return TableColumns;
	// }

	 //delete set - to do in the future (happens when user deletes his account)
	// @Get('/logout')
	// 	logout(@Request() req): any {
	// 		req.session.destroy();
	// 		return { msg: 'The user session has ended' }
	// 	}
}