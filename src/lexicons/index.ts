/**
 * GENERATED CODE - DO NOT MODIFY
 */
type Auth = AuthResult | undefined;

import {
	type AuthResult,
	createXRPCHono as createXrpcServer,
	type HonoConfigOrHandler,
	// type Auth,
	type XRPCHono as XrpcServer,
} from "@evex-dev/xrpc-hono";
import type { Env } from "hono";
import { schemas } from "./lexicons.js";
import type * as WinTomoXPushatPushNotify from "./types/win/tomo-x/pushat/pushNotify.js";

export function createServer<E extends Env = Env>(): Server<E> {
	return new Server();
}

export class Server<E extends Env> {
	xrpc: XrpcServer<E>;
	win: WinNS<E>;

	constructor() {
		this.xrpc = createXrpcServer(schemas);
		this.win = new WinNS(this);
	}
}

export class WinNS<E extends Env> {
	_server: Server<E>;
	tomoX: WinTomoXNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.tomoX = new WinTomoXNS(server);
	}
}

export class WinTomoXNS<E extends Env> {
	_server: Server<E>;
	pushat: WinTomoXPushatNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.pushat = new WinTomoXPushatNS(server);
	}
}

export class WinTomoXPushatNS<E extends Env> {
	_server: Server<E>;

	constructor(server: Server<E>) {
		this._server = server;
	}

	pushNotify<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			WinTomoXPushatPushNotify.QueryParams,
			WinTomoXPushatPushNotify.HandlerInput,
			WinTomoXPushatPushNotify.HandlerOutput
		>,
	) {
		const nsid = "win.tomo-x.pushat.pushNotify";
		return this._server.xrpc.method(nsid, cfg);
	}
}
