import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { App } from "firebase-admin/app";

export type Env = {
	Bindings: CloudflareBindings;
	Variables: { db: MyDB; firebase: App };
};

export type RegisterRequest = {
	token: string;
};

export type MyDB = DrizzleD1Database<{}>;
