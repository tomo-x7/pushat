import { createXRPCHono } from "@evex/xrpc-hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { schemas } from "./lexicons/lexicons";
import type { HandlerOutput } from "./lexicons/types/win/tomo-x/pushat/pushNotify";

type Env = {
	Bindings: CloudflareBindings;
	Variables: {};
};

const server = createXRPCHono<Env>(schemas);

server.addMethod("win.tomo-x.pushat.pushNotify", {
	auth: ({ ctx }) => {
		return { credentials: undefined };
	},
	handler: async (req) => {
		req.auth?.credentials;
		return {
			encoding: "application/json",
			body: { success: true, token: req.c.req.header("Authorization") },
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
	next();
});
app.route("/", inner);
app.get("/xrpc/", (c) => c.text("Hello World!"));

export default app;
