import type { ResourceType } from './Resource';

export interface User {
	id: string;
	balance: number;
	ownedResources: OwnedResources[];
}

export interface OwnedResources {
	type: ResourceType;
	amount: number;
}

export class UserEntity implements User {
	id: string;
	balance: number;
	ownedResources: OwnedResources[];

	private constructor(id: string, balance: number, ownedResources: OwnedResources[]) {
		this.id = id;
		this.balance = balance;
		this.ownedResources = ownedResources;
	}

	static create(data: Partial<User>): UserEntity {
		let { id, balance, ownedResources } = data;
		id ??= '';
		balance ??= 0;
		ownedResources ??= [];
		
		return new UserEntity(id, balance, ownedResources);
	}
}
