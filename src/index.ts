import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { verifyBearerAuth } from "./auth";
import { createServer } from "./lexicons";
import type { HandlerOutput } from "./lexicons/types/win/tomo-x/pushat/pushNotify";
import type { Env, RegisterRequest } from "./types";

const app = new Hono<Env>();
app.use(cors({ origin: "*", allowHeaders: ["*", "Authorization"] }));
app.use(async (c, next) => {
	const db = drizzle(c.env.DB);
	c.set("db", db);
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
const inner = server.xrpc.createApp();
app.route("/", inner);

export default app;
