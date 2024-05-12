import type { ILogger } from './ILogger';

export const ConsoleLogger: () => ILogger = () => {
	return {
		error: async (message: string) => {
			console.error(message);
			return true;
		},
		warning: async (message: string) => {
			console.warn(message);
			return true;
		},
		info: async (message: string) => {
			console.info(message);
			return true;
		},
	};
};
