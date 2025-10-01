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
import type * as WinTomoXPushatClientPushNotify from "./types/win/tomo-x/pushat/client/pushNotify.js";
import type * as WinTomoXPushatManageAddDevice from "./types/win/tomo-x/pushat/manage/addDevice.js";
import type * as WinTomoXPushatManageDeleteDevice from "./types/win/tomo-x/pushat/manage/deleteDevice.js";
import type * as WinTomoXPushatManageGetDevices from "./types/win/tomo-x/pushat/manage/getDevices.js";

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
	client: WinTomoXPushatClientNS<E>;
	manage: WinTomoXPushatManageNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.client = new WinTomoXPushatClientNS<E>(server);
		this.manage = new WinTomoXPushatManageNS<E>(server);
	}
}

export class WinTomoXPushatClientNS<E extends Env> {
	_server: Server<E>;

	constructor(server: Server<E>) {
		this._server = server;
	}

	pushNotify<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			WinTomoXPushatClientPushNotify.QueryParams,
			WinTomoXPushatClientPushNotify.HandlerInput,
			WinTomoXPushatClientPushNotify.HandlerOutput
		>,
	) {
		const nsid = "win.tomo-x.pushat.client.pushNotify";
		return this._server.xrpc.addMethod(nsid, cfg);
	}
}

export class WinTomoXPushatManageNS<E extends Env> {
	_server: Server<E>;

	constructor(server: Server<E>) {
		this._server = server;
	}

	addDevice<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			WinTomoXPushatManageAddDevice.QueryParams,
			WinTomoXPushatManageAddDevice.HandlerInput,
			WinTomoXPushatManageAddDevice.HandlerOutput
		>,
	) {
		const nsid = "win.tomo-x.pushat.manage.addDevice";
		return this._server.xrpc.addMethod(nsid, cfg);
	}

	deleteDevice<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			WinTomoXPushatManageDeleteDevice.QueryParams,
			WinTomoXPushatManageDeleteDevice.HandlerInput,
			WinTomoXPushatManageDeleteDevice.HandlerOutput
		>,
	) {
		const nsid = "win.tomo-x.pushat.manage.deleteDevice";
		return this._server.xrpc.addMethod(nsid, cfg);
	}

	getDevices<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			WinTomoXPushatManageGetDevices.QueryParams,
			WinTomoXPushatManageGetDevices.HandlerInput,
			WinTomoXPushatManageGetDevices.HandlerOutput
		>,
	) {
		const nsid = "win.tomo-x.pushat.manage.getDevices";
		return this._server.xrpc.addMethod(nsid, cfg);
	}
}
