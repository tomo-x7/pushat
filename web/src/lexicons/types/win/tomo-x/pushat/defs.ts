import { validate as _validate } from "../../../../lexicons.js";
import { is$typed as _is$typed } from "../../../../util.js";

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

export interface NotifyBody {
	$type?: "win.tomo-x.pushat.defs#notifyBody";
	/** Title text of the notification. */
	title: string;
	/** Body text of the notification. */
	body: string;
	/** The URI of the icon displayed in the notification. */
	icon?: string;
	/** Experimental — do not use. The URI to open when the notification is clicked. */
	link?: string;
}

const hashNotifyBody = "notifyBody";

export function isNotifyBody<V>(v: V) {
	return is$typed(v, id, hashNotifyBody);
}

export function validateNotifyBody<V>(v: V) {
	return validate<NotifyBody & V>(v, id, hashNotifyBody);
}
