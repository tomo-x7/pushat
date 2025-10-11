/**
 * GENERATED CODE - DO NOT MODIFY
 */

import { type HeadersMap, XRPCError } from "@atproto/xrpc";
import { validate as _validate } from "../../../../lexicons.js";
import { is$typed as _is$typed } from "../../../../util.js";
import type * as WinTomoXPushatDefs from "./defs.js";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.pushat.pushNotify";

export type QueryParams = {};

export interface InputSchema {
	body: WinTomoXPushatDefs.NotifyBody;
	/** The DID of the target user to whom the notification will be sent. */
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

export class ServiceNotAllowedError extends XRPCError {
	constructor(src: XRPCError) {
		super(src.status, src.error, src.message, src.headers, { cause: src });
	}
}

export function toKnownErr(e: any) {
	if (e instanceof XRPCError) {
		if (e.error === "ServiceNotAllowedError") return new ServiceNotAllowedError(e);
	}

	return e;
}
