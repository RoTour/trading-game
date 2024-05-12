export interface ILogger {
	error: (message: string) => Promise<boolean>;
	warning: (message: string) => Promise<boolean>;
	info: (message: string) => Promise<boolean>;
}
