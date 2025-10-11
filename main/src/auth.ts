import type { DidDocument } from "@atproto/common-web";
import { verifySignature } from "@atproto/crypto";
import type { ErrorResult } from "@evex-dev/xrpc-hono";
import { validateContentDigest } from "@tomo-x/pushat/digest";
import { type CryptoKeyWithKid, importPublicJwk, verifyRequest } from "@tomo-x/pushat/signature";
import type { Context } from "hono";
import { BadRequest, isHttpError, Unauthorized } from "http-errors";
import { AUD } from "./consts";
import { getDidDoc } from "./identity";
import type { Env } from "./types";

const BEARER_PREFIX = "Bearer ";
type AuthParam = { lxm: string };
type BearerAuth = (p: { ctx: Context<Env> }) => Promise<BearerAuthResult | ErrorResult>;
type ServerAuth = (p: { ctx: Context<Env> }) => Promise<ServerAuthResult | ErrorResult>;
type BearerOrServerAuth = (p: { ctx: Context<Env> }) => Promise<BearerAuthResult | ServerAuthResult | ErrorResult>;
export type BearerAuthResult = { credentials: { did: string }; artifacts: { type: "Bearer" } };
export type ServerAuthResult = { credentials: { did: string }; artifacts: { type: "Server" } };
export function normalBearerAuth({ lxm }: AuthParam): BearerAuth {
	return async ({ ctx }) => {
		const authorization = ctx.req.header("Authorization");
		if (authorization == null) return invalidAuth("Authorization header required");
		if (!authorization.startsWith(BEARER_PREFIX)) return invalidAuth("Invalid authorization: Bearer required");
		// token解析
		const token = authorization.slice(BEARER_PREFIX.length).trim();
		if (token.split(".").length !== 3) return invalidAuth("bad jwt length");
		const [headerRaw, payloadRaw, signature] = token.split(".");
		const header = JSON.parse(Buffer.from(headerRaw, "base64url").toString());
		const payload = JSON.parse(Buffer.from(payloadRaw, "base64url").toString());
		if (typeof header.typ === "string" && header.typ.toLowerCase() !== "jwt")
			return invalidAuth(`bad jwt type:jwt required but got ${header.typ}`);
		const iss = payload.iss;
		if (typeof iss !== "string") return invalidAuth("bad payload.iss");
		// diddoc取得
		const docs = await getDidDoc(iss).catch((e) => {
			console.error(e);
			return null;
		});
		if (docs == null || docs.key == null) return invalidAuth("invalid iss diddoc");
		// 署名検証
		const isValid = await verifySignature(
			docs.key,
			Buffer.from([headerRaw, payloadRaw].join(".")),
			Buffer.from(signature, "base64url"),
		).catch((e) => {
			console.error(e);
			return false;
		});
		if (!isValid) return invalidAuth("verify signature failed");
		// ペイロード検証
		if (!validateTime(payload.iat, payload.exp)) return invalidAuth("token expired");
		if (!validateAud(payload.aud)) return invalidAuth("invalid aud");
		if (!validateLxm(payload.lxm, lxm)) return invalidAuth("invalid lxm");

		return { credentials: { did: docs.did }, artifacts: { type: "Bearer" } };
	};
}

export function serverAuth(): ServerAuth {
	return async ({ ctx }) => {
		const digestResult = await validateContentDigest(ctx.req.raw);
		if (digestResult !== true) return invalidAuth(digestResult);
		let result: Awaited<ReturnType<typeof verifyRequest>> | undefined;
		try {
			result = await verifyRequest(ctx.req.raw, (...p) => getKey(...p));
		} catch (e) {
			if (isHttpError(e)) {
				return { status: e.status, message: e.message, error: e.name };
			}
			throw e;
		}
		if (result?.ok !== true) return invalidAuth(result?.error ?? "unknown error");
		return { credentials: { did: result.kid.split("#")[0] }, artifacts: { type: "Server" } };
	};
}
export function BearerOrServerAuth({ lxm }: AuthParam): BearerOrServerAuth {
	return async ({ ctx }) => {
		if (ctx.req.header("Authorization") != null) {
			return await normalBearerAuth({ lxm })({ ctx });
		} else {
			return await serverAuth()({ ctx });
		}
	};
}
type DidVerifyMethod = {
	id: string;
	type: string;
	controller: string;
	publicKeyJwk: object;
};
async function getKey(kid: string): Promise<CryptoKeyWithKid> {
	const [did, id] = kid.split("#");
	if (did == null || id == null) throw new Unauthorized("invalid kid");
	const { rawDoc } = (await getDidDoc(did)) ?? {};
	if (rawDoc == null) throw new Unauthorized("cannot get did doc");
	const authKeys = (rawDoc as DidDocument & { authentication?: (string | DidVerifyMethod)[] }).authentication;
	if (authKeys == null || authKeys.length === 0) throw new Unauthorized("invalid kid: authentication is empty");
	let key: Pick<DidVerifyMethod, "type" | "publicKeyJwk"> | undefined;
	if (authKeys.find((v) => typeof v === "string" && v === kid)) {
		for (const verifyKey of rawDoc.verificationMethod ?? []) {
			if (verifyKey.id === kid) {
				key = verifyKey as DidVerifyMethod;
				break;
			}
		}
	} else {
		key = authKeys.find((k): k is DidVerifyMethod => typeof k === "object" && k.id === kid);
	}
	if (key == null) throw new BadRequest("cannot get key from did doc");
	if (key.type !== "JsonWebKey2020") throw new BadRequest("invalid key type: only support JsonWebKey2020");
	return importPublicJwk(key.publicKeyJwk, kid);
}

function invalidAuth(message: string): ErrorResult {
	return { status: 401, message, error: "InvalidAuthError" };
}
function validateTime(iat: number, exp: number) {
	if (!Number.isFinite(iat) || !Number.isFinite(exp)) return false;
	const now = Date.now() / 1000;
	return iat <= now && now <= exp;
}
function validateAud(aud: unknown) {
	return typeof aud === "string" && AUD.includes(aud);
}
function validateLxm(tokenLxm: unknown, lxm: string) {
	return tokenLxm == null || tokenLxm === lxm;
}
