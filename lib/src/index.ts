import type { FetchHandlerObject } from "@atproto/xrpc";
import { getContentDigest } from "./digest.js";
import { AtpBaseClient, type WinTomoXPushatDefs, type WinTomoXPushatPushNotify } from "./lexicons/index.js";
import { type CryptoKeyWithKid, importPrivateJwkStr, signRequest } from "./signature.js";

export * from "./digest.js";
export * from "./signature.js";

interface SessionManager extends FetchHandlerObject {
	readonly did?: string;
}
export class PushatRequesterClient {
	private base: AtpBaseClient;
	public did: string;
	public serviceDid: string;
	/**
	 * @param session
	 * @param serviceDid
	 */
	constructor(session: SessionManager, serviceDid: string) {
		if (session.did == null) throw new Error("Login required");
		this.did = session.did;
		this.serviceDid = serviceDid;
		this.base = new AtpBaseClient((...p) => session.fetchHandler(...p));
		this.base.setHeader("atproto-proxy", "did:web:pushat.tomo-x.win#pushat");
	}
	async addAllowService() {
		return await this.base.win.tomoX.pushat.allow.put(
			{ repo: this.did, rkey: this.serviceDid },
			{ createdAt: new Date().toISOString() },
		);
	}
	async deleteAllowService() {
		return await this.base.win.tomoX.pushat.allow.delete({ repo: this.did, rkey: this.serviceDid });
	}
	async isAllowed() {
		try {
			await this.base.win.tomoX.pushat.allow.get({ repo: this.did, rkey: this.serviceDid });
			return true;
		} catch {
			return false;
		}
	}
}
export interface RequesterConfig {
	PrivateJwkStr: string;
	serviceDid: string;
}
export class PushatRequester {
	private readonly pushatUrl = "https://pushat.tomo-x.win";
	private constructor(
		public serviceDid: string,
		private keyobj: CryptoKeyWithKid,
	) {}
	static async create({ PrivateJwkStr, serviceDid }: RequesterConfig) {
		const keyobj = await importPrivateJwkStr(PrivateJwkStr);
		if (!keyobj.kid.startsWith(serviceDid)) throw new Error("kid and serviceDid mismatch");
		return new PushatRequester(serviceDid, keyobj);
	}

	async push(targetDid: string, body: WinTomoXPushatDefs.NotifyBody) {
		const reqBody = { target: targetDid, body } satisfies WinTomoXPushatPushNotify.InputSchema;
		const header = new Headers();
		header.set("Content-Type", "application/json");
		const req = new Request(`${this.pushatUrl}/xrpc/win.tomo-x.pushat.pushNotify`, {
			method: "POST",
			body: JSON.stringify(reqBody),
			headers: new Headers(header),
		});
		const digest = await getContentDigest(req);
		const sigs = await signRequest(req, this.keyobj, digest);
		header.set("Content-Digest", digest);
		header.set("Signature", sigs.Signature);
		header.set("Signature-Input", sigs["Signature-Input"]);
		const signedReq = new Request(req, { headers: header });
		return await fetch(signedReq).then(async (res) => {
			if (!res.ok) throw new Error(`pushNotify failed: ${res.status} ${res.statusText} ${await res.text()}`);
			return (await res.json()) as WinTomoXPushatPushNotify.OutputSchema;
		});
	}
}
