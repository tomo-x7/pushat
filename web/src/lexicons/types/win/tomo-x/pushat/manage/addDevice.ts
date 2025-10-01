/**
 * GENERATED CODE - DO NOT MODIFY
 */

import { type HeadersMap, XRPCError } from "@atproto/xrpc";
import { validate as _validate } from "../../../../../lexicons";
import { is$typed as _is$typed } from "../../../../../util";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.pushat.manage.addDevice";

export type QueryParams = {};

export interface InputSchema {
	token: string;
	name: string;
}

export interface OutputSchema {
	id: string;
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

export class AlreadyRegisteredError extends XRPCError {
	constructor(src: XRPCError) {
		super(src.status, src.error, src.message, src.headers, { cause: src });
	}
}

export function toKnownErr(e: any) {
	if (e instanceof XRPCError) {
		if (e.error === "AlreadyRegisteredError") return new AlreadyRegisteredError(e);
	}

	return e;
}
