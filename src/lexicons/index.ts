/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
	type Auth,
	createXRPCHono as createXrpcServer,
	type HonoConfigOrHandler,
	type HonoXRPCOptions as XrpcOptions,
	type XRPCHono as XrpcServer,
} from "@evex-dev/xrpc-hono";
import type { Env } from "hono";
import { schemas } from "./lexicons.js";
import type * as WinTomoXPushatPushNotify from "./types/win/tomo-x/pushat/pushNotify.js";
import type * as WinTomoXPushatRegisterToken from "./types/win/tomo-x/pushat/registerToken.js";

export function createServer<E extends Env = Env>(options?: XrpcOptions<E>): Server<E> {
	return new Server<E>(options);
}

export class Server<E extends Env> {
	xrpc: XrpcServer<E>;
	win: WinNS<E>;

	constructor(options?: XrpcOptions<E>) {
		this.xrpc = createXrpcServer<E>(schemas, options);
		this.win = new WinNS<E>(this);
	}
}

export class WinNS<E extends Env> {
	_server: Server<E>;
	tomoX: WinTomoXNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.tomoX = new WinTomoXNS<E>(server);
	}
}

export class WinTomoXNS<E extends Env> {
	_server: Server<E>;
	pushat: WinTomoXPushatNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.pushat = new WinTomoXPushatNS<E>(server);
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
		return this._server.xrpc.addMethod(nsid, cfg);
	}

	registerToken<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			WinTomoXPushatRegisterToken.QueryParams,
			WinTomoXPushatRegisterToken.HandlerInput,
			WinTomoXPushatRegisterToken.HandlerOutput
		>,
	) {
		const nsid = "win.tomo-x.pushat.registerToken";
		return this._server.xrpc.addMethod(nsid, cfg);
	}
}
