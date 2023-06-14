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
import { SetsService } from './sets.service';

@Controller('sets')
export class SetsController {
	constructor(private readonly setsService: SetsService) {}
	//create set
	@UseGuards(AuthenticatedGuard)
	@Post('/create')
	async createSet(
		@Request() request: any,
	) {
		const { user } = request;
		const result = await this.setsService.insertSet(
			user._id,
		);

		return {
			msg: 'Set successfully created',
			setOwner: result.user
		};
	}

	//Get user's set
	@UseGuards(AuthenticatedGuard)
	@Get('/set')
	async getUserSet(@Request() req): Promise<any> {
		const userId: mongoose.Types.ObjectId = req.user._id;
		const userSet = await this.setsService.getUserSet(userId);
		return userSet;
	}

	 //delete set - to do in the future (happens when user deletes his account)
	// @Get('/logout')
	// 	logout(@Request() req): any {
	// 		req.session.destroy();
	// 		return { msg: 'The user session has ended' }
	// 	}
}