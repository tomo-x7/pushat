/**
 * GENERATED CODE - DO NOT MODIFY
 */

import { type HeadersMap, XRPCError } from "@atproto/xrpc";
import { validate as _validate } from "../../../../lexicons.js";
import { is$typed as _is$typed } from "../../../../util.js";

const is$typed = _is$typed,
	validate = _validate;
const id = "com.atproto.repo.getRecord";

export type QueryParams = {
	/** The handle or DID of the repo. */
	repo: string;
	/** The NSID of the record collection. */
	collection: string;
	/** The Record Key. */
	rkey: string;
	/** The CID of the version of the record. If not specified, then return the most recent version. */
	cid?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
	uri: string;
	cid?: string;
	value: { [_ in string]: unknown };
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

export class RecordNotFoundError extends XRPCError {
	constructor(src: XRPCError) {
		super(src.status, src.error, src.message, src.headers, { cause: src });
	}
}

export function toKnownErr(e: any) {
	if (e instanceof XRPCError) {
		if (e.error === "RecordNotFound") return new RecordNotFoundError(e);
	}

	return e;
}
