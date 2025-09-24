import { customType, index, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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
		id: int().primaryKey({ autoIncrement: true }),
		did: text().notNull(),
		token: text().notNull(),
		createdAt: isoDateTime("created_at")
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: isoDateTime("updated_at")
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date()),
	},
	(table) => [index("devices_did_idx").on(table.did), unique().on(table.did)],
);
