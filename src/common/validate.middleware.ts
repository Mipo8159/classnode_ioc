import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const instance = plainToInstance(this.classToValidate, body);
		const errors = await validate(instance);

		if (errors.length) {
			res.status(422).send(errors);
		} else {
			next();
		}
	}
}
