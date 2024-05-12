import { ConsoleLogger } from '@common/application/interfaces/ConsoleLogger';
import type { User } from '@common/core/entities/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildBuyerFromUser, buildSellerFromUser, type Buyer, type Seller } from '../core/aggregates/Buyer';
import { useBuyResource } from '../core/usecases/useBuyResource';

describe('CORE: useBuyResource', () => {
	const logger = ConsoleLogger();
	const consoleErrorMock = vi.spyOn(console, 'error');
	
	let userBuyer: User;
	let userSeller: User;
	let buyer: Buyer;
	let seller: Seller;

	beforeEach(() => {
		userBuyer = {
			id: '1',
			balance: 1000,
			ownedResources: [],
		};
		userSeller = {
			id: '2',
			balance: 0,
			ownedResources: [
				{ type: 'WOOD', amount: 100 }
			],
		};
		buyer = buildBuyerFromUser(userBuyer);
		seller = buildSellerFromUser(userSeller, 'WOOD');
		consoleErrorMock.mockReset();
	});

	it('Should return false when buyer does not have enough balance', async () => {
		const { execute } = useBuyResource({
			buyer,
			seller,
			quantity: 100,
			unitPrice: 10000,
			resourceType: 'WOOD',
		});

		const result = await execute();

		expect(result).toBe(false);
	});

	it('should add resource to user when does not exists', async () => {
		const { execute } = useBuyResource({
			quantity: 100,
			unitPrice: 10,
			buyer: buyer,
			seller,
			resourceType: 'WOOD',
		});

		await execute();
		
		expect(userBuyer.ownedResources).toEqual([{ type: 'WOOD', amount: 100 }]);
	});

	it('should update resource amount when buying more', async () => {
		userBuyer.ownedResources = [{ type: 'WOOD', amount: 100 }];
		const buyer = buildBuyerFromUser(userBuyer);
		const { execute } = useBuyResource({
			quantity: 100,
			unitPrice: 10,
			buyer: buyer,
			seller,
			resourceType: 'WOOD',
		});

		await execute();

		expect(userBuyer.ownedResources).toEqual([{ type: 'WOOD', amount: 200 }]);
		expect(userBuyer.ownedResources.length).toBe(1);
	});

	it('should update buyer s balance when buying resource', async () => {
		const buyer = buildBuyerFromUser(userBuyer);
		const { execute } = useBuyResource({
			quantity: 100,
			unitPrice: 10,
			buyer: buyer,
			seller,
			resourceType: 'WOOD',
		});

		await execute();

		expect(userBuyer.balance).toBe(0);
	});

	it('should not update buyer s balance if transaction fails', async () => {
		const poorUser = {
			id: '3',
			balance: 10,
			ownedResources: [],
		};
		const poorBuyer = buildBuyerFromUser(poorUser);
		const { execute } = useBuyResource({
			quantity: 1,
			unitPrice: 1000,
			buyer: poorBuyer,
			seller,
			resourceType: 'WOOD',
		});

		await execute();

		expect(poorBuyer.balance).toBe(10);
	});

	it('should update resources from seller when transaction is completed', async () => {
		const { execute } = useBuyResource({
			quantity: 100,
			unitPrice: 10,
			buyer: buyer,
			seller: seller,
			resourceType: 'WOOD',
		});

		await execute();

		expect(userSeller.ownedResources).toEqual([{ type: 'WOOD', amount: 0 }]);
	});

	it('should not update resources from seller when transaction fails', async () => {
		const { execute } = useBuyResource({
			quantity: 1000,
			unitPrice: 10,
			buyer: buyer,
			seller: seller,
			resourceType: 'WOOD',
		});

		await execute();

		expect(userSeller.ownedResources).toEqual([{ type: 'WOOD', amount: 100 }]);
	});

	it('should update seller s balance when transaction is completed', async () => {
		const { execute } = useBuyResource({
			quantity: 100,
			unitPrice: 10,
			buyer,
			seller,
			resourceType: 'WOOD',
		});

		await execute();

		expect(userSeller.balance).toBe(1000);
	});

	it('should not update seller s balance when transaction fails', async () => {
		const { execute } = useBuyResource({
			quantity: 1000,
			unitPrice: 10,
			buyer,
			seller,
			resourceType: 'WOOD',
		});

		await execute();

		expect(userSeller.balance).toBe(0);
	});

	it('should log error when seller does not have enough resources', async () => {
		const { execute } = useBuyResource({
			quantity: 1000,
			unitPrice: 10,
			buyer,
			seller,
			resourceType: 'WOOD',
		}, logger);

		await execute();

		expect(consoleErrorMock).toHaveBeenCalledOnce();
	});

	it('should log error when buyer does not have enough balance', async () => {
		const { execute } = useBuyResource({
			quantity: 100,
			unitPrice: 1000,
			buyer,
			seller,
			resourceType: 'WOOD',
		}, logger);

		await execute();

		expect(consoleErrorMock).toHaveBeenCalledOnce();
	});
});
