import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed } from "../../../../util";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.pushat.defs";

export type DeviceList = DeviceListItem[];

export interface DeviceListItem {
	$type?: "win.tomo-x.pushat.defs#deviceListItem";
	name: string;
	id: string;
	current: boolean;
}

const hashDeviceListItem = "deviceListItem";

export function isDeviceListItem<V>(v: V) {
	return is$typed(v, id, hashDeviceListItem);
}

export function validateDeviceListItem<V>(v: V) {
	return validate<DeviceListItem & V>(v, id, hashDeviceListItem);
}
