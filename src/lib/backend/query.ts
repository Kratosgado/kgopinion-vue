import { limit, orderBy, query, where, type WhereFilterOp } from 'firebase/firestore';
import type { Collections } from '.';
import { getCollRef } from './helpers';

export type Direction = 'asc' | 'desc';

export class Query<T = any> {
	private readonly apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
	private readonly projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

	private q;
	constructor(collection: Collections) {
		this.q = query(getCollRef(collection));
	}

	orderBy(field: keyof T, direction: Direction = 'desc') {
		this.q = query(this.q, orderBy(field as string, direction));
		return this;
	}

	limit(n: number) {
		this.q = query(this.q, limit(n));
		return this;
	}

	where(field: keyof T, op: WhereFilterOp, value: unknown) {
		this.q = query(this.q, where(field as string, op, value));
		return this;
	}

	/** Counts the documents by executing the query and returning the length. */
	// async count(): Promise<number> {
	// 	// const snapshot = await this.get<T[]>();
	// 	return snapshot.length;
	// }
}
