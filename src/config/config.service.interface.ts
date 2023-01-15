export interface IConfigService {
	get: (key: string) => string;
	getNum: (key: string) => number;
}
