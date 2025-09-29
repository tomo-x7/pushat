import { eq } from "drizzle-orm";
import { getMessaging, Messaging } from "firebase-admin/messaging";
import { normalAuthLxm } from "./auth";
import { devicesTable } from "./db/schema";
import type { Server } from "./lexicons";
import type { Env } from "./types";

export function pushMethods(server: Server<Env>) {
	server.win.tomoX.pushat.pushNotify({
		auth: normalAuthLxm("win.tomo-x.pushat.pushNotify"),
		handler: async ({ auth, c, input }) => {
			const did = auth.credentials.did;
			const db = c.get("db");
			const tokens = (await db.select().from(devicesTable).where(eq(devicesTable.did, did))).map((d) => d.token);
			console.log("token:",tokens);
			const firebaseApp = c.get("firebase");
			const messaging = getMessaging(firebaseApp);
			console.log("getMessaging success")
			const { body, icon, title, link } = input.body;
			await messaging.sendEachForMulticast({
				tokens,
				notification: { title, body, imageUrl: icon },
				webpush: { fcmOptions: { link: link }, notification: {} },
			});
			return { encoding: "application/json", body: { success: true } };
		},
	});
}
