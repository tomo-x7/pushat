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
import type * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.js";
import type * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.js";
import type * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.js";
import type * as ComAtprotoRepoListRecords from "./types/com/atproto/repo/listRecords.js";
import type * as ComAtprotoRepoPutRecord from "./types/com/atproto/repo/putRecord.js";
import type * as WinTomoXPushatAddDevice from "./types/win/tomo-x/pushat/addDevice.js";
import type * as WinTomoXPushatDeleteDevice from "./types/win/tomo-x/pushat/deleteDevice.js";
import type * as WinTomoXPushatGetDevices from "./types/win/tomo-x/pushat/getDevices.js";
import type * as WinTomoXPushatPushNotify from "./types/win/tomo-x/pushat/pushNotify.js";

export function createServer<E extends Env = Env>(options?: XrpcOptions<E>): Server<E> {
	return new Server<E>(options);
}

export class Server<E extends Env> {
	xrpc: XrpcServer<E>;
	com: ComNS<E>;
	win: WinNS<E>;

	constructor(options?: XrpcOptions<E>) {
		this.xrpc = createXrpcServer<E>(schemas, options);
		this.com = new ComNS<E>(this);
		this.win = new WinNS<E>(this);
	}
}

export class ComNS<E extends Env> {
	_server: Server<E>;
	atproto: ComAtprotoNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.atproto = new ComAtprotoNS<E>(server);
	}
}

export class ComAtprotoNS<E extends Env> {
	_server: Server<E>;
	repo: ComAtprotoRepoNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.repo = new ComAtprotoRepoNS<E>(server);
	}
}

export class ComAtprotoRepoNS<E extends Env> {
	_server: Server<E>;

	constructor(server: Server<E>) {
		this._server = server;
	}

	createRecord<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			ComAtprotoRepoCreateRecord.QueryParams,
			ComAtprotoRepoCreateRecord.HandlerInput,
			ComAtprotoRepoCreateRecord.HandlerOutput
		>,
	) {
		const nsid = "com.atproto.repo.createRecord";
		return this._server.xrpc.addMethod(nsid, cfg);
	}

	deleteRecord<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			ComAtprotoRepoDeleteRecord.QueryParams,
			ComAtprotoRepoDeleteRecord.HandlerInput,
			ComAtprotoRepoDeleteRecord.HandlerOutput
		>,
	) {
		const nsid = "com.atproto.repo.deleteRecord";
		return this._server.xrpc.addMethod(nsid, cfg);
	}

	getRecord<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			ComAtprotoRepoGetRecord.QueryParams,
			ComAtprotoRepoGetRecord.HandlerInput,
			ComAtprotoRepoGetRecord.HandlerOutput
		>,
	) {
		const nsid = "com.atproto.repo.getRecord";
		return this._server.xrpc.addMethod(nsid, cfg);
	}

	listRecords<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			ComAtprotoRepoListRecords.QueryParams,
			ComAtprotoRepoListRecords.HandlerInput,
			ComAtprotoRepoListRecords.HandlerOutput
		>,
	) {
		const nsid = "com.atproto.repo.listRecords";
		return this._server.xrpc.addMethod(nsid, cfg);
	}

	putRecord<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			ComAtprotoRepoPutRecord.QueryParams,
			ComAtprotoRepoPutRecord.HandlerInput,
			ComAtprotoRepoPutRecord.HandlerOutput
		>,
	) {
		const nsid = "com.atproto.repo.putRecord";
		return this._server.xrpc.addMethod(nsid, cfg);
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
