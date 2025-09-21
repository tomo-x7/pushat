import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed } from "../../../../util";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.pushat.pushNotify";

export type QueryParams = {};

export interface InputSchema {
	title?: string;
}

export interface OutputSchema {
	success?: boolean;
}

export interface HandlerInput {
	encoding: "application/json";
	body: InputSchema;
}

export interface HandlerSuccess {
	encoding: "application/json";
	body: OutputSchema;
	headers?: { [key: string]: string };
}

export interface HandlerError {
	status: number;
	message?: string;
}

export type HandlerOutput = HandlerError | HandlerSuccess;
