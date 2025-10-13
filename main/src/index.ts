import { drizzle } from "drizzle-orm/d1";
import { type App, cert, initializeApp } from "firebase-admin/app";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { deviceMethods } from "./device";
import { createServer } from "./lexicons";
import { pushMethods } from "./push";
import { scheduled } from "./scheduled";
import type { Env, MyDB } from "./types";

const app = new Hono<Env>();
let db: MyDB;
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

pushMethods(server);
deviceMethods(server);

const inner = server.xrpc.createApp();
app.route("/", inner);

export default {
	fetch: app.fetch.bind(app),
	scheduled: (controller, env, ctx) => {
		if (db == null) {
			db = drizzle(env.DB);
		}
		ctx.waitUntil(scheduled(db));
	},
} satisfies ExportedHandler<CloudflareBindings>;
