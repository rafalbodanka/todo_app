import {
	Body,
	Controller,
	Get,
	Post,
	HttpCode,
	UseGuards,
	Request,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { UsersService } from './users.service';
import { SetsService } from 'src/sets/sets.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService,
		private readonly setsService: SetsService) {}
	//signup
	@Post('/signup')
	async addUser(
		@Body('password') userPassword: string,
		@Body('email') userEmail: string,
	) {

		const result = await this.usersService.insertUser(
			userEmail,
			userPassword,
		);

		// Create a set for the new user
		await this.setsService.insertSet(result._id);

		return {
			msg: 'User successfully registered',
			userId: result._id,
			userEmail: result.email
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
	 //Get / logout
	@Get('/logout')
		logout(@Request() req): any {
			req.session.destroy();
			return { msg: 'The user session has ended' }
		}

	// testing query
	@Get('/all')
	async getUser() {
		const users = await this.usersService.getAllUser(); // Execute the query
		return users;
	}
}