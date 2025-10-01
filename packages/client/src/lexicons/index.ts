/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type FetchHandler, type FetchHandlerOptions, XrpcClient } from "@atproto/xrpc";
import { schemas } from "./lexicons.js";
import type * as WinTomoXPushatPushNotify from "./types/win/tomo-x/pushat/pushNotify.js";

export * as WinTomoXPushatPushNotify from "./types/win/tomo-x/pushat/pushNotify.js";

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

	constructor(client: XrpcClient) {
		this._client = client;
	}

	pushNotify(
		data?: WinTomoXPushatPushNotify.InputSchema,
		opts?: WinTomoXPushatPushNotify.CallOptions,
	): Promise<WinTomoXPushatPushNotify.Response> {
		return this._client.call("win.tomo-x.pushat.pushNotify", opts?.qp, data, opts);
	}
}
