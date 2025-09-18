import { Hono } from "hono";
import { D1Database } from "@cloudflare/workers-types";
import { createXRPCHono } from "@evex/xrpc-hono";
import { schemas } from "./lexicons/lexicons";

type Env = {
	Bindings: {
		db: D1Database;
	};
	Variables: {};
};
const server = createXRPCHono<Env>(schemas);

server.addMethod("win.tomo-x.pushat.pushNotify", {
	handler: async (req) => {
		req.c.env.db;
		return { status: 200 };
	},
});
const inner = server.createApp();
const app = new Hono<Env>();
app.use(async (c, next) => {
	// ORMインスタンス作成
	next();
});
app.route("/", inner);

export default app;
