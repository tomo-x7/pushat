/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type FetchHandler, type FetchHandlerOptions, XrpcClient } from "@atproto/xrpc";
import { schemas } from "./lexicons.js";
import * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.js";
import * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.js";
import * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.js";
import * as WinTomoXPushatAddDevice from "./types/win/tomo-x/pushat/addDevice.js";
import type * as WinTomoXPushatDeleteDevice from "./types/win/tomo-x/pushat/deleteDevice.js";
import type * as WinTomoXPushatGetDevices from "./types/win/tomo-x/pushat/getDevices.js";
import type * as WinTomoXPushatPushNotify from "./types/win/tomo-x/pushat/pushNotify.js";

export * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.js";
export * as ComAtprotoRepoDefs from "./types/com/atproto/repo/defs.js";
export * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.js";
export * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.js";
export * as WinTomoXPushatAddDevice from "./types/win/tomo-x/pushat/addDevice.js";
export * as WinTomoXPushatDefs from "./types/win/tomo-x/pushat/defs.js";
export * as WinTomoXPushatDeleteDevice from "./types/win/tomo-x/pushat/deleteDevice.js";
export * as WinTomoXPushatGetDevices from "./types/win/tomo-x/pushat/getDevices.js";
export * as WinTomoXPushatPushNotify from "./types/win/tomo-x/pushat/pushNotify.js";

export class AtpBaseClient extends XrpcClient {
	com: ComNS;
	win: WinNS;

	constructor(options: FetchHandler | FetchHandlerOptions) {
		super(options, schemas);
		this.com = new ComNS(this);
		this.win = new WinNS(this);
	}

	/** @deprecated use `this` instead */
	get xrpc(): XrpcClient {
		return this;
	}
}

export class ComNS {
	_client: XrpcClient;
	atproto: ComAtprotoNS;

	constructor(client: XrpcClient) {
		this._client = client;
		this.atproto = new ComAtprotoNS(client);
	}
}

export class ComAtprotoNS {
	_client: XrpcClient;
	repo: ComAtprotoRepoNS;

	constructor(client: XrpcClient) {
		this._client = client;
		this.repo = new ComAtprotoRepoNS(client);
	}
}

export class ComAtprotoRepoNS {
	_client: XrpcClient;

	constructor(client: XrpcClient) {
		this._client = client;
	}

	createRecord(
		data?: ComAtprotoRepoCreateRecord.InputSchema,
		opts?: ComAtprotoRepoCreateRecord.CallOptions,
	): Promise<ComAtprotoRepoCreateRecord.Response> {
		return this._client.call("com.atproto.repo.createRecord", opts?.qp, data, opts).catch((e) => {
			throw ComAtprotoRepoCreateRecord.toKnownErr(e);
		});
	}

	deleteRecord(
		data?: ComAtprotoRepoDeleteRecord.InputSchema,
		opts?: ComAtprotoRepoDeleteRecord.CallOptions,
	): Promise<ComAtprotoRepoDeleteRecord.Response> {
		return this._client.call("com.atproto.repo.deleteRecord", opts?.qp, data, opts).catch((e) => {
			throw ComAtprotoRepoDeleteRecord.toKnownErr(e);
		});
	}

	getRecord(
		params?: ComAtprotoRepoGetRecord.QueryParams,
		opts?: ComAtprotoRepoGetRecord.CallOptions,
	): Promise<ComAtprotoRepoGetRecord.Response> {
		return this._client.call("com.atproto.repo.getRecord", params, undefined, opts).catch((e) => {
			throw ComAtprotoRepoGetRecord.toKnownErr(e);
		});
	}
}

export class WinNS {
	_client: XrpcClient;
	tomoX: WinTomoXNS;

	constructor(client: XrpcClient) {
		this._client = client;
		this.tomoX = new WinTomoXNS(client);
	}
}

export class WinTomoXNS {
	_client: XrpcClient;
	pushat: WinTomoXPushatNS;

	constructor(client: XrpcClient) {
		this._client = client;
		this.pushat = new WinTomoXPushatNS(client);
	}
}

export class WinTomoXPushatNS {
	_client: XrpcClient;

	constructor(client: XrpcClient) {
		this._client = client;
	}

	addDevice(
		data?: WinTomoXPushatAddDevice.InputSchema,
		opts?: WinTomoXPushatAddDevice.CallOptions,
	): Promise<WinTomoXPushatAddDevice.Response> {
		return this._client.call("win.tomo-x.pushat.addDevice", opts?.qp, data, opts).catch((e) => {
			throw WinTomoXPushatAddDevice.toKnownErr(e);
		});
	}

	deleteDevice(
		data?: WinTomoXPushatDeleteDevice.InputSchema,
		opts?: WinTomoXPushatDeleteDevice.CallOptions,
	): Promise<WinTomoXPushatDeleteDevice.Response> {
		return this._client.call("win.tomo-x.pushat.deleteDevice", opts?.qp, data, opts);
	}

	getDevices(
		data?: WinTomoXPushatGetDevices.InputSchema,
		opts?: WinTomoXPushatGetDevices.CallOptions,
	): Promise<WinTomoXPushatGetDevices.Response> {
		return this._client.call("win.tomo-x.pushat.getDevices", opts?.qp, data, opts);
	}

	pushNotify(
		data?: WinTomoXPushatPushNotify.InputSchema,
		opts?: WinTomoXPushatPushNotify.CallOptions,
	): Promise<WinTomoXPushatPushNotify.Response> {
		return this._client.call("win.tomo-x.pushat.pushNotify", opts?.qp, data, opts);
	}
}
