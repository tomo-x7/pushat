import { eq } from "drizzle-orm";
import { getMessaging } from "firebase-admin/messaging";
import { BearerOrServerAuth } from "./auth";
import { devicesTable } from "./db/schema";
import { getDidDoc } from "./identity";
import type { Server } from "./lexicons";
import * as allow from "./lexicons/types/win/tomo-x/pushat/allow";
import type { Env } from "./types";

export function pushMethods(server: Server<Env>) {
	server.win.tomoX.pushat.pushNotify({
		auth: BearerOrServerAuth({ lxm: "win.tomo-x.pushat.pushNotify" }),
		handler: async ({ auth, c, input }) => {
			if (auth.artifacts.type === "Bearer") {
				if (input.body.target !== auth.credentials.did)
					throw new Error("target must be same as authenticated did");
			} else if (auth.artifacts.type === "Server") {
				const targetDoc = await getDidDoc(input.body.target);
				if (targetDoc == null || targetDoc.pds == null) throw new Error("invalid target did");
				const res = await fetch(
					`${targetDoc.pds}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(input.body.target)}&collection=win.tomo-x.pushat.allow&rkey=${auth.credentials.did}`,
				)
					.then((res) => (res.ok ? (res.json() as Promise<{value:allow.Record}>) : null))
					.catch(() => null);
				if (res == null) return { error: "ServiceNotAllowedError", status: 403 };
				if (allow.validateRecord(res.value).success === false)
					return { error: "ServiceNotAllowedError", status: 403, message: "invalid allow record" };
			} else {
				throw new Error("unknown auth type");
			}
			const did = input.body.target;
			const db = c.get("db");
			const tokens = (await db.select().from(devicesTable).where(eq(devicesTable.did, did))).map((d) => d.token);
			const firebaseApp = c.get("firebase");
			const messaging = getMessaging(firebaseApp);
			messaging.enableLegacyHttpTransport();
			const { body, icon, title, link } = input.body.body;
			await messaging.sendEachForMulticast({
				tokens,
				notification: { title, body, imageUrl: icon },
				webpush: {
					notification: {
						icon,
						title,
						body,
						data: { link },
					},
				},
			});
			return { encoding: "application/json", body: { success: true } };
		},
	});
}
