/**
 * GENERATED CODE - DO NOT MODIFY
 */

import { type HeadersMap, XRPCError } from "@atproto/xrpc";
import { validate as _validate } from "../../../../lexicons.js";
import { is$typed as _is$typed } from "../../../../util.js";
import type * as ComAtprotoRepoDefs from "./defs.js";

const is$typed = _is$typed,
	validate = _validate;
const id = "com.atproto.repo.deleteRecord";

export type QueryParams = {};

export interface InputSchema {
	/** The handle or DID of the repo (aka, current account). */
	repo: string;
	/** The NSID of the record collection. */
	collection: string;
	/** The Record Key. */
	rkey: string;
	/** Compare and swap with the previous record by CID. */
	swapRecord?: string;
	/** Compare and swap with the previous commit by CID. */
	swapCommit?: string;
}

export interface OutputSchema {
	commit?: ComAtprotoRepoDefs.CommitMeta;
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

export class InvalidSwapError extends XRPCError {
	constructor(src: XRPCError) {
		super(src.status, src.error, src.message, src.headers, { cause: src });
	}
}

export function toKnownErr(e: any) {
	if (e instanceof XRPCError) {
		if (e.error === "InvalidSwap") return new InvalidSwapError(e);
	}

	return e;
}
