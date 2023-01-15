import { injectable } from 'inversify';
import { Logger } from 'tslog';
import { ILogger } from './logger.interface';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
	logger: Logger<any>;

	constructor() {
		this.logger = new Logger({
			type: 'pretty',
			name: 'logger',
		});
	}

	log(...args: unknown[]): void {
		return this.logger.info(args);
	}

	error(...args: unknown[]): void {
		return this.logger.error(args);
	}

	warn(...args: unknown[]): void {
		return this.logger.warn(args);
	}
}
