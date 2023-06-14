import {
	Body,
	Controller,
	Get,
	Post,
	HttpCode,
	UseGuards,
	Request,
} from '@nestjs/common';
import * as mongoose from "mongoose"
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
		const result = await this.columnsService.insertColumn(
            title,
			tableId,
		);

		return {
			msg: 'Column successfully created',
            title: result.title,
		};
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