import { ConsoleLogger } from '@common/application/interfaces/ConsoleLogger';
import type { ILogger } from '@common/application/interfaces/ILogger';
import type { AsyncUseCase } from '@common/core/interfaces/Usecase';
import type { Buyer, Seller } from '../aggregates/Buyer';
import type { Transaction } from '../entities/Transaction';
import { TransactionEvents, type TransactionError } from '../events/TransactionEvents';

type BuyResourceUseCase = AsyncUseCase<void, boolean> & { transaction: Transaction };

const onTransactionCompleted = (transaction: Transaction, buyer: Buyer, seller: Seller) => {
	if (transaction.buyer.userId !== buyer.userId) return;
	const totalPrice = transaction.quantity * transaction.unitPrice;
	buyer.updateBalance(-totalPrice);
	buyer.updateOwnedResources(transaction.resourceType, transaction.quantity);
	seller.updateBalance(totalPrice);
	seller.updateOwnedResources(transaction.resourceType, -transaction.quantity);
};

const onTransactionFailed = async (
	data: TransactionError,
	logger: ILogger,
) => {
	await logger.error(data.message);
};

export const useBuyResource = (data: Transaction, logger: ILogger = ConsoleLogger()): BuyResourceUseCase => {
	const { quantity, unitPrice, buyer, seller } = data;
	const onComplete = TransactionEvents.transactionCompleted.subscribe((transaction) =>
		onTransactionCompleted(transaction, buyer, seller)
	);
	const onFail = TransactionEvents.transactionFailed.subscribe((transaction) =>
		onTransactionFailed(transaction, logger)
	);

	const cleanup = () => {
		TransactionEvents.transactionCompleted.unsubscribe(onComplete);
		TransactionEvents.transactionFailed.unsubscribe(onFail);
	}

	return {
		execute: async () => {
			if (seller.sellingResource.amount < quantity) {
				TransactionEvents.transactionFailed.emit({...data, message: 'Seller does not have enough resources'});
				cleanup();
				return false;
			}
			const totalPrice = quantity * unitPrice;
			
			if (buyer.balance < totalPrice) {
				TransactionEvents.transactionFailed.emit({...data, message: 'Buyer does not have enough balance'});
				cleanup();
				return false;
			}

			TransactionEvents.transactionCompleted.emit(data);
			cleanup();
			return true;
		},
		transaction: data
	};
};
