import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http.error.class';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../DI.types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private readonly logger: LoggerService) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		this.logger.error(`${err.message}`);
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.ctx}] error ${err.code}:${err.message}`);
			res.status(err.code).json({ error: err.message });
		} else {
			res.status(500).json({ error: err.message });
			this.logger.error(`${err.message}`);
		}
	}
}
