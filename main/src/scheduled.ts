import { and, eq, or } from "drizzle-orm";
import type { WinTomoXPushatAllow } from "../../lib/dist/lexicons";
import { allowTable, cursorsTable } from "./db/schema";
import type { MyDB } from "./types";

const CRON_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const DB_KEY = "jetstream_scheduled";

export async function scheduled(db: MyDB) {
	const raw = await db.select().from(cursorsTable).where(eq(cursorsTable.id, DB_KEY)).limit(1).catch(console.error);
	console.log("load cursor" ,JSON.stringify(raw));
	// cursorはマイクロ秒 (A unix microseconds timestamp cursor to begin playback from)
	// 存在しない場合は前回を推定
	const cursor = numOrNull(raw?.[0]?.cursor) ?? (Date.now() - CRON_INTERVAL_MS) * 1000;
	const ws = new WebSocket(
		`wss://jetstream1.us-east.bsky.network/subscribe?wantedCollections=win.tomo-x.pushat.allow&cursor=${cursor}`,
	);
	const stack = new MessageStack(db);
	const finishCursor = Date.now() * 1000;
	ws.addEventListener("message", async (ev) => {
		try {
			const data = JSON.parse(ev.data) as CreateAllow | DeleteAllow;
			if (data.time_us > finishCursor) {
				ws.close(1000,"done");
				return;
			}
			if (data.kind !== "commit") return;
			if (data.commit.collection !== "win.tomo-x.pushat.allow") return;
			if (data.commit.operation === "create") {
				stack.push({ type: "insert", did: data.did, serviceDid: data.commit.rkey, time_us: data.time_us, });
			} else if (data.commit.operation === "delete") {
				stack.push({ type: "delete", did: data.did, serviceDid: data.commit.rkey, time_us: data.time_us, });
			}
		} catch (e) {
			stack.logError(e);
		}
	});
	await new Promise<void>((resolve) =>
		ws.addEventListener("close", (ev) => {
			if(ev.code !== 1000) {
				console.error(`WebSocket closed abnormally`);
				console.dir(ev)
			}
			resolve();
		}),
	);
	await stack.waitAll();
}

class MessageStack {
	private insertMap = new Map<string, DBInsertMessage>();
	private deleteMap = new Map<string, DBDeleteMessage>();
	private flushSet = new Set<Promise<unknown>>();

	private latestCursor: number = 0;
	private errorStuck: unknown[] = [];

	constructor(
		private db: MyDB,
		private maxSize = 10,
	) {}
	private calcKey(data: DBMessage) {
		return `${data.did}|||${data.serviceDid}`;
	}
	logError(e: unknown) {
		this.errorStuck.push(e);
	}
	push(data: DBMessage) {
		const Key = this.calcKey(data);
		if (data.type === "insert") {
			this.deleteMap.delete(Key);
			this.insertMap.set(Key, data);
		} else if (data.type === "delete") {
			this.insertMap.delete(Key);
			this.deleteMap.set(Key, data);
		}
		this.latestCursor = Math.max(this.latestCursor, data.time_us);
		if (this.insertMap.size + this.deleteMap.size > this.maxSize) this.flush();
	}
	flush() {
		const inserts = batch(this.insertMap.values().toArray(), 200, (value) =>
			this.db
				.insert(allowTable)
				.values(value.map(({ did, serviceDid }) => ({ did, serviceDid })))
				.onConflictDoNothing()
				.catch(this.logError.bind(this)),
		);
		this.insertMap.clear();
		const deletes = batch(this.deleteMap.values().toArray(), 200, (value) =>
			this.db
				.delete(allowTable)
				.where(
					or(
						...value.map(({ did, serviceDid }) =>
							and(eq(allowTable.did, did), eq(allowTable.serviceDid, serviceDid)),
						),
					),
				)
				.catch(this.logError.bind(this)),
		);
		this.deleteMap.clear();
		const p = Promise.allSettled([...inserts, ...deletes])
			.then(async () => {
				if (this.latestCursor > 0) {
					const newCursorStr = this.latestCursor.toString();
					await this.db
						.insert(cursorsTable)
						.values({ id: DB_KEY, cursor: newCursorStr })
						.onConflictDoUpdate({ target: [cursorsTable.id], set: { cursor: newCursorStr } })
						.catch(this.logError.bind(this));
				}
			})
			.finally(() => this.flushSet.delete(p))
			.finally(() => {
				if (this.errorStuck.length > 0) {
					console.error(...this.errorStuck);
					this.errorStuck = [];
				}
			});
		this.flushSet.add(p);
	}
	async waitAll() {
		this.flush();
		await Promise.allSettled(this.flushSet);
		console.log("waitAll done");
	}
}

function numOrNull(s: string | null | undefined | void): number | null {
	if (s == null) return null;
	const n = Number.parseInt(s, 10);
	if (Number.isNaN(n)) return null;
	return n;
}

function batch<DataType, ReturnType>(
	data: DataType[],
	max: number,
	action: (data: DataType[]) => ReturnType,
): ReturnType[] {
	const results: ReturnType[] = [];
	for (let i = 0; i < data.length; i += max) {
		results.push(action(data.slice(i, i + max)));
	}
	return results;
}

type CreateAllow = {
	did: string;
	time_us: number;
	kind: "commit";
	commit: {
		rev: string;
		operation: "create";
		collection: "win.tomo-x.pushat.allow";
		rkey: string;
		record: WinTomoXPushatAllow.Record;
		cid: string;
	};
};
type DeleteAllow = {
	did: string;
	time_us: number;
	kind: "commit";
	commit: {
		rev: string;
		operation: "delete";
		collection: "win.tomo-x.pushat.allow";
		rkey: string;
	};
};

type DBMessage = DBInsertMessage | DBDeleteMessage;
type DBInsertMessage = {
	type: "insert";
	did: string;
	serviceDid: string;
	time_us: number;
};
type DBDeleteMessage = {
	type: "delete";
	did: string;
	serviceDid: string;
	time_us: number;
};
