import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { type App, cert, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { verifyBearerAuth } from "./auth";
import { devicesTable } from "./db/schema";
import { createServer } from "./lexicons";
import type { HandlerOutput } from "./lexicons/types/win/tomo-x/pushat/pushNotify";
import type { Env } from "./types";

const app = new Hono<Env>();
let db: DrizzleD1Database;
let firebaseApp: App;
app.use(cors({ origin: "*", allowHeaders: ["*", "Authorization"] }));
app.use(async (c, next) => {
	if (db == null) {
		db = drizzle(c.env.DB);
	}
	if (firebaseApp == null) {
		firebaseApp = initializeApp({
			credential: cert({
				projectId: c.env.FIREBASE_PROJECT_ID,
				clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
				privateKey: c.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
			}),
		});
	}
	c.set("db", db);
	c.set("firebase", firebaseApp);
	try {
		await next();
	} finally {
	}
});
app.get("/xrpc/", (c) => c.text("Hello World!"));

const server = createServer<Env>();

server.win.tomoX.pushat.pushNotify({
	auth: ({ ctx }) => {
		return verifyBearerAuth(ctx.req.header("Authorization"), "win.tomo-x.pushat.pushNotify");
	},
	handler: async ({ c, auth }) => {
		const firebaseApp = c.get("firebase");
		const messaging = getMessaging(firebaseApp);
		messaging.send({
			token: "",
			notification: {},
			webpush: { fcmOptions: { link: "" }, notification: {} },
		});
		return {
			encoding: "application/json",
			body: { success: true, token: c.req.header("Authorization") },
			credentials: auth.credentials,
		} satisfies HandlerOutput & {
			[key: string]: unknown;
		};
	},
});
server.win.tomoX.pushat.registerToken({
	auth: async ({ ctx }) => {
		return verifyBearerAuth(ctx.req.header("Authorization"), "win.tomo-x.pushat.registerToken");
	},
	handler: async ({ c, input, auth }) => {
		const result = await c
			.get("db")
			.insert(devicesTable)
			.values({ did: auth.credentials.did, token: input.body.token })
			.onConflictDoUpdate({ set: { token: input.body.token }, target: devicesTable.did });
		return { encoding: "application/json", body: { success: result.success } };
	},
});
const inner = server.xrpc.createApp();
app.route("/", inner);

export default app;
