import { eq } from "drizzle-orm";
import { getMessaging } from "firebase-admin/messaging";
import { normalBearerAuth } from "./auth";
import { devicesTable } from "./db/schema";
import type { Server } from "./lexicons";
import type { Env } from "./types";

export function pushMethods(server: Server<Env>) {
	server.win.tomoX.pushat.client.pushNotify({
		auth: normalBearerAuth({ lxm: "win.tomo-x.pushat.pushNotify" }),
		handler: async ({ auth, c, input }) => {
			if (input.body.target !== auth.credentials.did) throw new Error("target must be same as authenticated did");
			const did = auth.credentials.did;
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
