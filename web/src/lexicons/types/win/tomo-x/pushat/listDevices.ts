/**
 * GENERATED CODE - DO NOT MODIFY
 */

import type { HeadersMap } from "@atproto/xrpc";
import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed } from "../../../../util";
import type * as WinTomoXPushatDefs from "./defs.js";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.pushat.listDevices";

export type QueryParams = {};
export type InputSchema = undefined;

export interface OutputSchema {
	devices: WinTomoXPushatDefs.DeviceList;
}

export interface CallOptions {
	signal?: AbortSignal;
	headers?: HeadersMap;
}

export interface Response {
	success: boolean;
	headers: HeadersMap;
	data: OutputSchema;
}

export function toKnownErr(e: any) {
	return e;
}
