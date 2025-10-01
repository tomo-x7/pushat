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
import type * as WinTomoXPushatAddDevice from "./types/win/tomo-x/pushat/addDevice.js";
import type * as WinTomoXPushatDeleteDevice from "./types/win/tomo-x/pushat/deleteDevice.js";
import type * as WinTomoXPushatGetDevices from "./types/win/tomo-x/pushat/getDevices.js";
import type * as WinTomoXPushatPushNotify from "./types/win/tomo-x/pushat/pushNotify.js";

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

	addDevice<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			WinTomoXPushatAddDevice.QueryParams,
			WinTomoXPushatAddDevice.HandlerInput,
			WinTomoXPushatAddDevice.HandlerOutput
		>,
	) {
		const nsid = "win.tomo-x.pushat.addDevice";
		return this._server.xrpc.addMethod(nsid, cfg);
	}

	deleteDevice<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			WinTomoXPushatDeleteDevice.QueryParams,
			WinTomoXPushatDeleteDevice.HandlerInput,
			WinTomoXPushatDeleteDevice.HandlerOutput
		>,
	) {
		const nsid = "win.tomo-x.pushat.deleteDevice";
		return this._server.xrpc.addMethod(nsid, cfg);
	}

	getDevices<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			WinTomoXPushatGetDevices.QueryParams,
			WinTomoXPushatGetDevices.HandlerInput,
			WinTomoXPushatGetDevices.HandlerOutput
		>,
	) {
		const nsid = "win.tomo-x.pushat.getDevices";
		return this._server.xrpc.addMethod(nsid, cfg);
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
}
