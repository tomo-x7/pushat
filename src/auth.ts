import { verifySignature } from "@atproto/crypto";
import type { ErrorResult } from "@evex/xrpc-hono";
import { AUD } from "./consts";
import { getDidDoc } from "./identity";

const BEARER_PREFIX = "Bearer ";
export type BearerAuthResult = { credentials: { did: string } };
export async function verifyBearerAuth(
	authorization: string | undefined | null,
	lxm: string,
): Promise<ErrorResult | BearerAuthResult> {
	if (authorization == null) return invalidAuth("Authorization header required");
	if (!authorization.startsWith(BEARER_PREFIX)) return invalidAuth("Invalid authorization: Bearer required");
	// token解析
	const token = authorization.slice(BEARER_PREFIX.length).trim();
	if (token.split(".").length !== 3) return invalidAuth("bad jwt length");
	const [headerRaw, payloadRaw, signature] = token.split(".");
	const header = JSON.parse(atob(headerRaw));
	const payload = JSON.parse(atob(payloadRaw));
	if (typeof header.typ === "string" && header.typ.toLowerCase() !== "jwt")
		return invalidAuth(`bad jwt type:jwt required but got ${header.typ}`);
	const iss = payload.iss;
	if (typeof iss !== "string") return invalidAuth("bad payload.iss");
	// diddoc取得
	const doc = await getDidDoc(iss).catch((e) => {
		console.error(e);
		return null;
	});
	if (doc == null) return invalidAuth("invalid iss diddoc");
	// 署名検証
	const isValid = await verifySignature(
		doc.key,
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

	return { credentials: { did: doc.did } };
}
function invalidAuth(message: string): ErrorResult {
	return { status: 401, message, error: "InvalidAuthError" };
}
function validateTime(iat: number, exp: number) {
	const now = Date.now() / 1000;
	return iat <= now && now <= exp;
}
function validateAud(aud: unknown) {
	return typeof aud === "string" && AUD.includes(aud);
}
function validateLxm(tokenLxm: unknown, lxm: string) {
	return tokenLxm == null || tokenLxm === lxm;
}
