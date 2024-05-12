import type { ResourceType } from '@common/core/entities/Resource';
import type { User } from '@common/core/entities/User';

export interface Buyer {
	readonly userId: string;
	readonly balance: number;
	updateOwnedResources: (resourceType: ResourceType, quantity: number) => void;
	updateBalance: (amount: number) => void;
}

export const buildBuyerFromUser = (user: User): Buyer => {
	return {
		userId: user.id,
		balance: user.balance,
		updateBalance: (amount) => {
			user.balance += amount;
		},
		updateOwnedResources: (resourceType, amount) => {
			const resource = user.ownedResources.find((r) => r.type === resourceType);
			if (resource) {
				resource.amount += amount;
			} else {
				user.ownedResources.push({ type: resourceType, amount });
			}
		},
	};
};

export interface Seller extends Buyer {
	readonly sellingResource: { type: ResourceType, amount: number };
}
export const buildSellerFromUser = (user: User, resource: ResourceType): Seller => {
	const buyer = buildBuyerFromUser(user);
	const sellingResource = user.ownedResources.find((r) => r.type === resource);
	if (!sellingResource) {
		throw new Error('Seller must have the resource to sell');
	}
	return {
		...buyer,
		sellingResource: sellingResource,
	};
};