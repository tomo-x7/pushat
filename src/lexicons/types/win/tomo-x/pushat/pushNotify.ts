import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed } from "../../../../util";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.pushat.pushNotify";

export type QueryParams = {};

export interface InputSchema {
	title?: string;
}

export interface HandlerInput {
	encoding: "application/json";
	body: InputSchema;
}

export interface HandlerError {
	status: number;
	message?: string;
}

export type HandlerOutput = HandlerError | void;
