/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type FetchHandler, type FetchHandlerOptions, XrpcClient } from "@atproto/xrpc";
import { schemas } from "./lexicons.js";
import type * as WinTomoXPushatClientPushNotify from "./types/win/tomo-x/pushat/client/pushNotify.js";
import * as WinTomoXPushatManageAddDevice from "./types/win/tomo-x/pushat/manage/addDevice.js";
import type * as WinTomoXPushatManageDeleteDevice from "./types/win/tomo-x/pushat/manage/deleteDevice.js";
import type * as WinTomoXPushatManageGetDevices from "./types/win/tomo-x/pushat/manage/getDevices.js";

export * as WinTomoXPushatClientPushNotify from "./types/win/tomo-x/pushat/client/pushNotify.js";
export * as WinTomoXPushatDefs from "./types/win/tomo-x/pushat/defs.js";
export * as WinTomoXPushatManageAddDevice from "./types/win/tomo-x/pushat/manage/addDevice.js";
export * as WinTomoXPushatManageDeleteDevice from "./types/win/tomo-x/pushat/manage/deleteDevice.js";
export * as WinTomoXPushatManageGetDevices from "./types/win/tomo-x/pushat/manage/getDevices.js";

export class AtpBaseClient extends XrpcClient {
	win: WinNS;

	constructor(options: FetchHandler | FetchHandlerOptions) {
		super(options, schemas);
		this.win = new WinNS(this);
	}

	/** @deprecated use `this` instead */
	get xrpc(): XrpcClient {
		return this;
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
	client: WinTomoXPushatClientNS;
	manage: WinTomoXPushatManageNS;

	constructor(client: XrpcClient) {
		this._client = client;
		this.client = new WinTomoXPushatClientNS(client);
		this.manage = new WinTomoXPushatManageNS(client);
	}
}

export class WinTomoXPushatClientNS {
	_client: XrpcClient;

	constructor(client: XrpcClient) {
		this._client = client;
	}

	pushNotify(
		data?: WinTomoXPushatClientPushNotify.InputSchema,
		opts?: WinTomoXPushatClientPushNotify.CallOptions,
	): Promise<WinTomoXPushatClientPushNotify.Response> {
		return this._client.call("win.tomo-x.pushat.client.pushNotify", opts?.qp, data, opts);
	}
}

export class WinTomoXPushatManageNS {
	_client: XrpcClient;

	constructor(client: XrpcClient) {
		this._client = client;
	}

	addDevice(
		data?: WinTomoXPushatManageAddDevice.InputSchema,
		opts?: WinTomoXPushatManageAddDevice.CallOptions,
	): Promise<WinTomoXPushatManageAddDevice.Response> {
		return this._client.call("win.tomo-x.pushat.manage.addDevice", opts?.qp, data, opts).catch((e) => {
			throw WinTomoXPushatManageAddDevice.toKnownErr(e);
		});
	}

	deleteDevice(
		data?: WinTomoXPushatManageDeleteDevice.InputSchema,
		opts?: WinTomoXPushatManageDeleteDevice.CallOptions,
	): Promise<WinTomoXPushatManageDeleteDevice.Response> {
		return this._client.call("win.tomo-x.pushat.manage.deleteDevice", opts?.qp, data, opts);
	}

	getDevices(
		data?: WinTomoXPushatManageGetDevices.InputSchema,
		opts?: WinTomoXPushatManageGetDevices.CallOptions,
	): Promise<WinTomoXPushatManageGetDevices.Response> {
		return this._client.call("win.tomo-x.pushat.manage.getDevices", opts?.qp, data, opts);
	}
}
