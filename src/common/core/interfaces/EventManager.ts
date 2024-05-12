export interface EventManager<T> {
	subscribe(callback: (data: T) => void): string;
	unsubscribe(id: string): void;
	unsubscribeAll(): void;
	emit(data: T): void;
}

export const EventManager = <T>(): EventManager<T> => {
	const subscribers: { id: string; fn: (data: T) => void }[] = [];

	return {
		subscribe: (fn) => {
			const id = Math.random().toString(36).slice(2, 9);
			subscribers.push({ id, fn });
			return id;
		},
		unsubscribe: (id) => {
			const index = subscribers.findIndex((subscriber) => subscriber.id === id);
			if (index !== -1) {
				subscribers.splice(index, 1);
			}
		},
		unsubscribeAll: () => {
			subscribers.splice(0, subscribers.length);
		},
		emit: (data) => {
			subscribers.forEach((subscriber) => subscriber.fn(data));
		},
	};
};
