import type { ResourceType } from '@common/core/entities/Resource';
import type { Buyer, Seller } from '../aggregates/Buyer';

export interface Transaction {
	quantity: number;
	unitPrice: number;
	buyer: Buyer;
	seller: Seller;
	resourceType: ResourceType;
};