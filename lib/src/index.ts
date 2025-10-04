import type { FetchHandler, FetchHandlerOptions } from "@atproto/xrpc";
import { AtpBaseClient } from "./lexicons/index.js";

export * from "./digest.js";
export * from "./signature.js";

export class PushatAgent {
	private base: AtpBaseClient;
	constructor(fetchHandler: FetchHandler | FetchHandlerOptions) {
		this.base = new AtpBaseClient(fetchHandler);
	}
	allowService() {}
}
