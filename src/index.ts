import { Hono } from "hono";
import { cors } from "hono/cors";
import { verifyBearerAuth } from "./auth";
import { createServer } from "./lexicons";
import type { HandlerOutput } from "./lexicons/types/win/tomo-x/pushat/pushNotify";
import type { Env } from "./types";

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
const app = new Hono<Env>();
app.use(cors({ origin: "*", allowHeaders: ["*", "Authorization"] }));
app.use(async (c, next) => {
	// ORMインスタンス作成
	await next();
});
app.route("/", inner);
app.get("/xrpc/", (c) => c.text("Hello World!"));

export default app;
