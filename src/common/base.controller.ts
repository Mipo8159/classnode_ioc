import { Response, Router } from 'express';
import { LoggerService } from '../logger/logger.service';
import { ExpressReturnType, IRoute } from './route.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private readonly logger: LoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, data: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(data);
	}

	public ok<T>(res: Response, data: T): ExpressReturnType {
		return this.send<T>(res, 200, data);
	}

	public create(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	protected bindRouter(routes: IRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);

			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);

			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline); // can be an array
		}
	}
}
