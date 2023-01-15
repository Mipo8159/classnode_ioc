export class HTTPError extends Error {
	code: number;
	ctx?: string;

	constructor(code: number, message: string, ctx: string) {
		super(message);

		this.code = code;
		this.ctx = ctx;
	}
}
