/**
 * GENERATED CODE - DO NOT MODIFY
 */

import type { HeadersMap } from "@atproto/xrpc";
import { validate as _validate } from "../../../../../lexicons.js";
import { is$typed as _is$typed } from "../../../../../util.js";
import type * as WinTomoXPushatDefs from "../defs.js";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.pushat.client.pushNotify";

export type QueryParams = {};

export interface InputSchema {
	body: WinTomoXPushatDefs.NotifyBody;
	target: string;
}

export type OutputSchema = {};

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
