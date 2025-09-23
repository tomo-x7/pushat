import { createXRPCHono } from "@evex/xrpc-hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { schemas } from "./lexicons/lexicons";
import type { HandlerOutput,HandlerInput,QueryParams } from "./lexicons/types/win/tomo-x/pushat/pushNotify";
import type { Env } from "./types";
import { BearerAuthResult, verifyBearerAuth } from "./auth";

const server = createXRPCHono<Env>(schemas);

server.addMethod<QueryParams,HandlerInput,HandlerOutput,BearerAuthResult>("win.tomo-x.pushat.pushNotify", {
	auth: ({ ctx }) => {
		return verifyBearerAuth(ctx.req.header("Authorization"), "win.tomo-x.pushat.pushNotify");
	},
	handler: async (req) => {
		return {
			encoding: "application/json",
			body: { success: true, token: req.c.req.header("Authorization") },
			credentials:req.auth.credentials,
		} satisfies HandlerOutput & {
			[key: string]: unknown;
		};
	},
});
const inner = server.createApp();
const app = new Hono<Env>();
app.use(cors({ origin: "*", allowHeaders: ["*", "Authorization"] }));
app.use(async (c, next) => {
	// ORMインスタンス作成
	await next();
});
app.route("/", inner);
app.get("/xrpc/", (c) => c.text("Hello World!"));

export default app;
