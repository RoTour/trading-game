export interface Resource {
	name: string;
	price: number;
	rarity: number;
	amountAvailable: number;
	totalMarketAmount: number;
}

export const ResourceType = {
	WOOD: 'Wood',
	STONE: 'Stone',
	FOOD: 'Food',
	IRON: 'Iron',
	CLAY: 'Clay',
	GOLD: 'Gold',
	DIAMOND: 'Diamond',
	URANIUM: 'Uranium',
	PLATINUM: 'Platinum'
} as const;

export type ResourceType = keyof typeof ResourceType

export const ResourceRarity = {
	WOOD: 1,
	STONE: 1,
	FOOD: 1,
	IRON: 2,
	CLAY: 2,
	GOLD: 3,
	DIAMOND: 4,
	URANIUM: 5,
	PLATINUM: 6,
} as const;