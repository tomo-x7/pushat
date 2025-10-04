/**
 * GENERATED CODE - DO NOT MODIFY
 */

import type { HeadersMap } from "@atproto/xrpc";
import { validate as _validate } from "../../../../lexicons.js";
import { is$typed as _is$typed } from "../../../../util.js";

const is$typed = _is$typed,
	validate = _validate;
const id = "com.atproto.repo.listRecords";

export type QueryParams = {
	/** The handle or DID of the repo. */
	repo: string;
	/** The NSID of the record type. */
	collection: string;
	/** The number of records to return. */
	limit?: number;
	cursor?: string;
	/** Flag to reverse the order of the returned records. */
	reverse?: boolean;
};
export type InputSchema = undefined;

export interface OutputSchema {
	cursor?: string;
	records: Record[];
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

export interface Record {
	$type?: "com.atproto.repo.listRecords#record";
	uri: string;
	cid: string;
	value: { [_ in string]: unknown };
}

const hashRecord = "record";

export function isRecord<V>(v: V) {
	return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
	return validate<Record & V>(v, id, hashRecord);
}
