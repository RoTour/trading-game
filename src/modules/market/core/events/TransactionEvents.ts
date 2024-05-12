import { EventManager } from '@common/core/interfaces/EventManager';
import type { Transaction } from '../entities/Transaction';

export type TransactionError = Transaction & { message: string };

export const TransactionEvents = {
	transactionCompleted: EventManager<Transaction>(),
	transactionFailed: EventManager<TransactionError>(),
}