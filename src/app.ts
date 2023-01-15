import { AuthMiddleware } from './common/auth.middleware';
import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './DI.types';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { IUserController } from './users/user.controller.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private readonly logger: ILogger,
		@inject(TYPES.UserController)
		private readonly userController: UserController,
		@inject(TYPES.ExceptionFilter)
		private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService)
		private readonly configService: IConfigService,
		@inject(TYPES.PrismaService)
		private readonly prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 5000;
	}

	useMiddlewares(): void {
		this.app.use(express.json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();
		this.prismaService.connect();

		this.server = this.app.listen(this.port);
		this.logger.log(`server running on http://localhost:${this.port}`);
	}
}
