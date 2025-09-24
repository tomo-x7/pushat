import type { DrizzleD1Database } from "drizzle-orm/d1";

export type Env = {
	Bindings: CloudflareBindings;
	Variables: { db: DrizzleD1Database };
};

export type RegisterRequest = {
	token: string;
};
