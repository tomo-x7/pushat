import { getMessaging } from "firebase-admin/messaging";
import { normalAuthLxm } from "./auth";
import type { Server } from "./lexicons";
import type { Env } from "./types";

export function pushMethods(server: Server<Env>) {
	server.win.tomoX.pushat.pushNotify({
		auth: normalAuthLxm("win.tomo-x.pushat.pushNotify"),
		handler: async ({ auth, c, input }) => {
			const firebaseApp = c.get("firebase");
			const messaging = getMessaging(firebaseApp);
			messaging.send({
				token: "",
				notification: {},
				webpush: { fcmOptions: { link: "" }, notification: {} },
			});
			return { encoding: "application/json", body: { success: true } };
		},
	});
}
