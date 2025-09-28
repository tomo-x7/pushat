import { customType, index, int, primaryKey, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

const isoDateTime = customType<{
	data: Date; // type of TypeScript
	driverData: string; // type of DB
}>({
	dataType: (): string => "text", // type of DB
	toDriver: (value: Date): string => value.toISOString(), // TypeScript -> DB
	fromDriver: (value: string): Date => new Date(value), // DB -> TypeScript
});

export const devicesTable = sqliteTable(
	"devices",
	{
		did: text().notNull(),
		id: text().notNull().primaryKey(),
		name: text().notNull(),
		token: text().notNull(),
		createdAt: isoDateTime("created_at")
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: isoDateTime("updated_at")
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date()),
	},
	(table) => [unique().on(table.did, table.token), index("devices_did_idx").on(table.did)],
);
