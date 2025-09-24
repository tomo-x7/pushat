import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { verifyBearerAuth } from "./auth";
import { devicesTable } from "./db/schema";
import { createServer } from "./lexicons";
import type { HandlerOutput } from "./lexicons/types/win/tomo-x/pushat/pushNotify";
import type { Env } from "./types";
import { initializeApp,cert } from "firebase-admin/app";

const app = new Hono<Env>();
app.use(cors({ origin: "*", allowHeaders: ["*", "Authorization"] }));
app.use(async (c, next) => {
	const db = drizzle(c.env.DB);
	const firebaseApp=initializeApp({credential:cert({
		projectId: c.env.FIREBASE_PROJECT_ID,
		clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
		privateKey: c.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
	})})
	c.set("db", db);
	c.set("firebase", firebaseApp);

	// ORMインスタンス作成
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
	handler: async (req) => {
		return {
			encoding: "application/json",
			body: { success: true, token: req.c.req.header("Authorization") },
			credentials: req.auth.credentials,
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
