import { TYPES } from './../DI.types';
import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';

@injectable()
export class ConfigService implements IConfigService {
	private _config: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private readonly logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('can not find env file');
		} else {
			this.logger.log('[ConfigService] env loaded');
			this._config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this._config[key];
	}

	getNum(key: string): number {
		return Number(this._config[key]);
	}
}
