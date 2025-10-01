/**
 * GENERATED CODE - DO NOT MODIFY
 */

import type { HeadersMap } from "@atproto/xrpc";
import { validate as _validate } from "../../../../../lexicons";
import { is$typed as _is$typed, type $Typed } from "../../../../../util";
import type * as WinTomoXPushatDefs from "../defs.js";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.pushat.manage.getDevices";

export type QueryParams = {};

export interface InputSchema {
	token: string;
}

export interface OutputSchema {
	devices: WinTomoXPushatDefs.DeviceList;
	current: $Typed<RegisteredDevice> | $Typed<UnregisteredDevice> | { $type: string };
}

export interface CallOptions {
	signal?: AbortSignal;
	headers?: HeadersMap;
	qp?: QueryParams;
	encoding?: "application/json";
}

export interface Response {
	success: boolean;
	headers: HeadersMap;
	data: OutputSchema;
}

export function toKnownErr(e: any) {
	return e;
}

export interface RegisteredDevice {
	$type?: "win.tomo-x.pushat.manage.getDevices#registeredDevice";
	id: string;
	name: string;
}

const hashRegisteredDevice = "registeredDevice";

export function isRegisteredDevice<V>(v: V) {
	return is$typed(v, id, hashRegisteredDevice);
}

export function validateRegisteredDevice<V>(v: V) {
	return validate<RegisteredDevice & V>(v, id, hashRegisteredDevice);
}

export interface UnregisteredDevice {
	$type?: "win.tomo-x.pushat.manage.getDevices#unregisteredDevice";
}

const hashUnregisteredDevice = "unregisteredDevice";

export function isUnregisteredDevice<V>(v: V) {
	return is$typed(v, id, hashUnregisteredDevice);
}

export function validateUnregisteredDevice<V>(v: V) {
	return validate<UnregisteredDevice & V>(v, id, hashUnregisteredDevice);
}
