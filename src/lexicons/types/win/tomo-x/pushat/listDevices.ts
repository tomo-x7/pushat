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

export type HandlerInput = undefined;

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
