import { verifySignature } from "@atproto/crypto";
import type { ErrorResult } from "@evex-dev/xrpc-hono";
import type { Context } from "hono";
import { AUD } from "./consts";
import { getDidDoc } from "./identity";
import type { Env } from "./types";

const BEARER_PREFIX = "Bearer ";
type AuthParam = { lxm: string };
type Auth = (p: { ctx: Context<Env> }) => Promise<BearerAuthResult | ErrorResult>;
export type BearerAuthResult = { credentials: { did: string } };
export function normalBearerAuth({ lxm }: AuthParam): Auth {
	return async ({ ctx }) => {
		const authorization = ctx.req.header("Authorization");
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
	};
}

export function serverAuth(p: AuthParam): Auth {
	return async ({ ctx }) => {
		const digest = ctx.req.header("Digest");
		const rawSignature = ctx.req.header("Signature");
		const rawSignatureInput = ctx.req.header("Signature-Input");
		if (digest == null || rawSignature == null || rawSignatureInput == null) return invalidAuth("Header missing");
		const signatureInput = rawSignatureInput.split(";").map((s) => s.trim());
		return invalidAuth("");
	};
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

type SigInput = { keyid: string; coveredComponents: Record<string, string[]> };
function parseSignatureInput(input: string): SigInput | null {
	const sigBaseReg = /([a-z0-9-]+)=\((.*?)\)/;
	const keyidReg = /keyid="(.*?)"/;
	const keyid = input.match(keyidReg)?.[1];
	if (keyid == null) return null;
	const coveredComponents: Record<string, string[]> = {};
	for (const match of input.matchAll(sigBaseReg)) {
		if (match.length !== 3) return null;
		const [_, label, value] = match;
		coveredComponents[label] = value.split(" ").map((v) => v.trim());
	}
	return { keyid, coveredComponents };
}
