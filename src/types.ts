import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { App } from "firebase-admin/app";

export type Env = {
	Bindings: CloudflareBindings;
	Variables: { db: DrizzleD1Database; firebase: App };
};

export type RegisterRequest = {
	token: string;
};
