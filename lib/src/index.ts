import type { FetchHandler, FetchHandlerOptions } from "@atproto/xrpc";
import { AtpBaseClient } from "./lexicons/index.js";

export * from "./digest.js";
export * from "./signature.js";

export class PushatAgent extends AtpBaseClient {
	constructor(fetchHandler: FetchHandler | FetchHandlerOptions) {
		super(fetchHandler);
	}
	addDevice(...params: Parameters<AtpBaseClient["win"]["tomoX"]["pushat"]["addDevice"]>) {
		return this.win.tomoX.pushat.addDevice(...params);
	}
	deleteDevice(...params: Parameters<AtpBaseClient["win"]["tomoX"]["pushat"]["deleteDevice"]>) {
		return this.win.tomoX.pushat.deleteDevice(...params);
	}
	getDevices(...params: Parameters<AtpBaseClient["win"]["tomoX"]["pushat"]["getDevices"]>) {
		return this.win.tomoX.pushat.getDevices(...params);
	}
}
