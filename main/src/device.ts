import { TID } from "@atproto/common-web";
import { and, eq } from "drizzle-orm";
import { normalBearerAuth } from "./auth";
import { devicesTable } from "./db/schema";
import type { Server } from "./lexicons";
import type { Env } from "./types";

export function deviceMethods(server: Server<Env>) {
	server.win.tomoX.pushat.addDevice({
		auth: normalBearerAuth({ lxm: "win.tomo-x.pushat.addDevice" }),
		handler: async ({ auth, c, input }) => {
			const db = c.get("db");
			const did = auth.credentials.did;
			const { name, token } = input.body;
			const addDB = async (id: string, isSecond = false): Promise<string | "conflict"> => {
				try {
					const res = await db
						.insert(devicesTable)
						.values({ did, name, token, id })
						.returning({ id: devicesTable.id })
						.onConflictDoNothing({ target: devicesTable.id });
					if (res?.[0]?.id != null) return res[0].id;
					if (isSecond) throw new Error("Cannot add device");
					return addDB(TID.nextStr(id), true);
				} catch (e) {
					if (/unique/i.test(String(e))) {
						return "conflict";
					}
					throw e;
				}
			};
			const result = await addDB(TID.nextStr());
			if (result === "conflict") return { error: "AlreadyRegisteredError", status: 400 };
			return { encoding: "application/json", body: { id: result } };
		},
	});

	server.win.tomoX.pushat.getDevices({
		auth: normalBearerAuth({ lxm: "win.tomo-x.pushat.getDevices" }),
		handler: async ({ auth, c, input }) => {
			const db = c.get("db");
			const did = auth.credentials.did;
			const currentToken = input.body.token;
			const devicesData = await db.select().from(devicesTable).where(eq(devicesTable.did, did));
			const devices = devicesData
				.toSorted((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
				.map(({ id, name, token }) => ({ id, name, current: token === currentToken }));
			const currentData = devicesData.find(({ token }) => token === currentToken);
			const current =
				currentData == null
					? { $type: "win.tomo-x.pushat.getDevices#unregisteredDevice" }
					: {
							$type: "win.tomo-x.pushat.getDevices#registeredDevice",
							id: currentData.id,
							name: currentData.name,
						};
			return { encoding: "application/json", body: { devices, current } };
		},
	});

	server.win.tomoX.pushat.deleteDevice({
		auth: normalBearerAuth({ lxm: "win.tomo-x.pushat.deleteDevice" }),
		handler: async ({ auth, c, input }) => {
			const db = c.get("db");
			const did = auth.credentials.did;
			const id = input.body.id;
			await db.delete(devicesTable).where(and(eq(devicesTable.id, id), eq(devicesTable.did, did)));
			return { encoding: "application/json", body: {} };
		},
	});
}
