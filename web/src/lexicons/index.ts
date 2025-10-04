/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type FetchHandler, type FetchHandlerOptions, XrpcClient } from "@atproto/xrpc";
import { schemas } from "./lexicons.js";
import * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.js";
import * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.js";
import * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.js";
import type * as ComAtprotoRepoListRecords from "./types/com/atproto/repo/listRecords.js";
import * as ComAtprotoRepoPutRecord from "./types/com/atproto/repo/putRecord.js";
import * as WinTomoXPushatAddDevice from "./types/win/tomo-x/pushat/addDevice.js";
import type * as WinTomoXPushatAllow from "./types/win/tomo-x/pushat/allow.js";
import type * as WinTomoXPushatDeleteDevice from "./types/win/tomo-x/pushat/deleteDevice.js";
import type * as WinTomoXPushatGetDevices from "./types/win/tomo-x/pushat/getDevices.js";
import type * as WinTomoXPushatPushNotify from "./types/win/tomo-x/pushat/pushNotify.js";
import type { OmitKey, Un$Typed } from "./util.js";

export * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.js";
export * as ComAtprotoRepoDefs from "./types/com/atproto/repo/defs.js";
export * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.js";
export * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.js";
export * as ComAtprotoRepoListRecords from "./types/com/atproto/repo/listRecords.js";
export * as ComAtprotoRepoPutRecord from "./types/com/atproto/repo/putRecord.js";
export * as WinTomoXPushatAddDevice from "./types/win/tomo-x/pushat/addDevice.js";
export * as WinTomoXPushatAllow from "./types/win/tomo-x/pushat/allow.js";
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

	listRecords(
		params?: ComAtprotoRepoListRecords.QueryParams,
		opts?: ComAtprotoRepoListRecords.CallOptions,
	): Promise<ComAtprotoRepoListRecords.Response> {
		return this._client.call("com.atproto.repo.listRecords", params, undefined, opts);
	}

	putRecord(
		data?: ComAtprotoRepoPutRecord.InputSchema,
		opts?: ComAtprotoRepoPutRecord.CallOptions,
	): Promise<ComAtprotoRepoPutRecord.Response> {
		return this._client.call("com.atproto.repo.putRecord", opts?.qp, data, opts).catch((e) => {
			throw ComAtprotoRepoPutRecord.toKnownErr(e);
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
	allow: WinTomoXPushatAllowRecord;

	constructor(client: XrpcClient) {
		this._client = client;
		this.allow = new WinTomoXPushatAllowRecord(client);
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

export class WinTomoXPushatAllowRecord {
	_client: XrpcClient;

	constructor(client: XrpcClient) {
		this._client = client;
	}

	async list(params: OmitKey<ComAtprotoRepoListRecords.QueryParams, "collection">): Promise<{
		cursor?: string;
		records: { uri: string; value: WinTomoXPushatAllow.Record }[];
	}> {
		const res = await this._client.call("com.atproto.repo.listRecords", {
			collection: "win.tomo-x.pushat.allow",
			...params,
		});
		return res.data;
	}

	async get(
		params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, "collection">,
	): Promise<{ uri: string; cid: string; value: WinTomoXPushatAllow.Record }> {
		const res = await this._client.call("com.atproto.repo.getRecord", {
			collection: "win.tomo-x.pushat.allow",
			...params,
		});
		return res.data;
	}

	async create(
		params: OmitKey<ComAtprotoRepoCreateRecord.InputSchema, "collection" | "record">,
		record: Un$Typed<WinTomoXPushatAllow.Record>,
		headers?: Record<string, string>,
	): Promise<{ uri: string; cid: string }> {
		const collection = "win.tomo-x.pushat.allow";
		const res = await this._client.call(
			"com.atproto.repo.createRecord",
			undefined,
			{ collection, ...params, record: { ...record, $type: collection } },
			{ encoding: "application/json", headers },
		);
		return res.data;
	}

	async put(
		params: OmitKey<ComAtprotoRepoPutRecord.InputSchema, "collection" | "record">,
		record: Un$Typed<WinTomoXPushatAllow.Record>,
		headers?: Record<string, string>,
	): Promise<{ uri: string; cid: string }> {
		const collection = "win.tomo-x.pushat.allow";
		const res = await this._client.call(
			"com.atproto.repo.putRecord",
			undefined,
			{ collection, ...params, record: { ...record, $type: collection } },
			{ encoding: "application/json", headers },
		);
		return res.data;
	}

	async delete(
		params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
		headers?: Record<string, string>,
	): Promise<void> {
		await this._client.call(
			"com.atproto.repo.deleteRecord",
			undefined,
			{ collection: "win.tomo-x.pushat.allow", ...params },
			{ headers },
		);
	}
}
