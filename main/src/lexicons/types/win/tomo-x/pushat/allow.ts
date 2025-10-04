import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed } from "../../../../util";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.pushat.allow";

export interface Record {
	$type: "win.tomo-x.pushat.allow";
	createdAt: string;
	[k: string]: unknown;
}

const hashRecord = "main";

export function isRecord<V>(v: V) {
	return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
	return validate<Record & V>(v, id, hashRecord, true);
}
