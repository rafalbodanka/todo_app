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
import { TablesService } from '../services/tables.service';

@Controller('tables')
export class TablesController {
	constructor(private readonly tablesService: TablesService) {}
	//create table
	@UseGuards(AuthenticatedGuard)
	@Post('/create')
	async createTable(
		@Body('title') title: string,
		@Request() req,
		@Res() res,
	) {
		const userId: mongoose.Types.ObjectId = req.user.id
		const result = await this.tablesService.insertTable(
            title,
			userId,
			);

	return res.status(HttpStatus.CREATED).json({
		message: 'Table successfully created',
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

	//delete table
	@UseGuards(AuthenticatedGuard)
	@Post('/delete/:id')
	async deleteTable(
		@Param('id') id: string,
		@Request() req,
		@Res() res,
	) {
		const userId: mongoose.Types.ObjectId = req.user.id
		const result = await this.tablesService.deleteTable(
      id,
			userId.toString(),
			);

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
}