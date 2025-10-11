import { ValidationError } from "@atproto/lexicon";
import {
	type FetchHandlerObject,
	httpResponseBodyParse,
	isErrorResponseBody,
	XRPCError,
	XRPCInvalidResponseError,
	XRPCResponse,
} from "@atproto/xrpc";
import { getContentDigest } from "./digest.js";
import { AtpBaseClient, type WinTomoXPushatDefs, WinTomoXPushatPushNotify } from "./lexicons/index.js";
import { lexicons } from "./lexicons/lexicons.js";
import { type CryptoKeyWithKid, importPrivateJwkStr, signRequest } from "./signature.js";

interface SessionManager extends FetchHandlerObject {
	readonly did?: string;
}
export class PushatRequesterClient {
	private base: AtpBaseClient;
	public did: string;
	public serviceDid: string;
	/**
	 * Create a client that can call server-side endpoints to manage allow records.
	 *
	 * @param session - An object providing fetch handler and session information (e.g. OAuth or credential session).
	 *                  Must include `did` for the currently authenticated user.
	 * @param serviceDid - DID of the requester/service (used as rkey when writing allow records).
	 * @throws Error if `session.did` is not present.
	 */
	constructor(session: SessionManager, serviceDid: string) {
		if (session.did == null) throw new Error("Login required");
		this.did = session.did;
		this.serviceDid = serviceDid;
		this.base = new AtpBaseClient((...p) => session.fetchHandler(...p));
		this.base.setHeader("atproto-proxy", "did:web:pushat.tomo-x.win#pushat");
	}

	/**
	 * Grant permission for the configured service to send push notifications for the current user.
	 * If updating settings, call allow again instead of revoking (disallowing) first.
	 * @param config - Optional configuration object supplied by the service.
	 * @returns Promise resolving to the created record response from the AT Protocol endpoint.
	 */
	async allow(config?:{[_:string]:unknown}) {
		return await this.base.win.tomoX.pushat.allow.put(
			{ repo: this.did, rkey: this.serviceDid },
			{ createdAt: new Date().toISOString(),config },
		);
	}

	/**
	 * Revoke previously granted permission.
	 *
	 * @returns Promise that resolves when the allow record is deleted.
	 */
	async disallow() {
		await this.base.win.tomoX.pushat.allow.delete({ repo: this.did, rkey: this.serviceDid });
	}

	/**
	 * Check whether the configured service is currently allowed to send push notifications.
	 *
	 * @returns Promise resolving to true if allowed, false otherwise.
	 */
	async isAllowed(): Promise<boolean> {
		try {
			// If the record cannot be retrieved the endpoint will throw; treat that as not allowed
			await this.base.win.tomoX.pushat.allow.get({ repo: this.did, rkey: this.serviceDid });
			return true;
		} catch {
			return false;
		}
	}
	/**
	 * Get the configuration object for the configured service.
	 * @returns A Promise that resolves to the config object if allowed, undefined if no config is stored, or null if not allowed.
	 */
	async getConfig(){
		try {
			const res=await this.base.win.tomoX.pushat.allow.get({ repo: this.did, rkey: this.serviceDid });
			return res.value.config;
		} catch {
			return null;
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

	/**
	 * Create a PushatRequester instance from configuration.
	 *
	 * @param config.PrivateJwkStr - Private JWK string used for signing requests.
	 * @param config.serviceDid - Service DID; the key's kid must start with this DID.
	 * @returns A new PushatRequester instance.
	 * @throws Error if the key's kid does not match serviceDid.
	 */
	static async create({ PrivateJwkStr, serviceDid }: RequesterConfig) {
		const keyobj = await importPrivateJwkStr(PrivateJwkStr);
		if (!keyobj.kid.startsWith(serviceDid)) throw new Error("kid and serviceDid mismatch");
		return new PushatRequester(serviceDid, keyobj);
	}

	/**
	 * Send a push notification to a target DID using the pushat server.
	 *
	 * @param targetDid - The DID of the notification recipient.
	 * @param body - Notification body matching the lexicon schema.
	 * @returns The parsed XRPC response on success.
	 * @throws XRPCError or mapped known errors on failure.
	 */
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
		return await fetch(signedReq)
			.then(async (res) => {
				const resHeaders = Object.fromEntries(res.headers.entries());
				const resBodyBytes = await res.arrayBuffer();
				const resBody = httpResponseBodyParse(res.headers.get("content-type"), resBodyBytes);
				if (res.status === 200) {
					try {
						lexicons.assertValidXrpcOutput("win.tomo-x.pushat.pushNotify", resBody);
						return new XRPCResponse(resBody, resHeaders) as WinTomoXPushatPushNotify.Response;
					} catch (e) {
						if (e instanceof ValidationError)
							throw new XRPCInvalidResponseError("win.tomo-x.pushat.pushNotify", e, res);
						else throw e;
					}
				}
				const { error = undefined, message = undefined } =
					resBody && isErrorResponseBody(resBody) ? resBody : {};
				throw new XRPCError(res.status, error, message, resHeaders);
			})
			.catch((e) => {
				throw WinTomoXPushatPushNotify.toKnownErr(e);
			});
	}
}

export { ServiceNotAllowedError } from "./lexicons/types/win/tomo-x/pushat/pushNotify.js";
