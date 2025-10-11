import { Buffer } from "buffer";

export type CryptoKeyWithKid = {
	key: CryptoKey;
	kid: string;
};

/**
 * Import a private JWK string and return a crypto key plus kid.
 *
 * Requirements:
 * - Key type must be EC
 * - Curve must be P-521
 * - Algorithm, if present, must be ES512
 * - JWK must include a private exponent `d` and a `kid` that is a DID fragment
 *
 * @param jwkStr - JSON string containing the private JWK
 * @returns An object with the imported CryptoKey and its `kid`.
 * @throws Error when the JWK is invalid or does not meet the constraints.
 */
export async function importPrivateJwkStr(jwkStr: string): Promise<CryptoKeyWithKid> {
	const jwk = JSON.parse(jwkStr);
	const { kty, crv, alg, d, x, y, kid } = jwk as JsonWebKey & { kid: string };
	if (kty !== "EC") throw new Error("kty must be EC");
	if (x == null || y == null) throw new Error("invalid key");
	if (!crv) throw new Error("crv is required");
	if (d == null) throw new Error("private key required");
	if (kid == null) throw new Error("kid required");
	if (alg != null && alg !== "ES512") throw new Error(`only support ES512`);
	if (crv !== "P-521") throw new Error(`only support P-521`);
	if (/^did:[a-z0-9]+:[a-zA-Z0-9.-]+#[a-zA-Z0-9]+$/.test(kid) === false)
		throw new Error("invalid kid: kid must be did with fragment");
	if (!kid.startsWith("did:web:") && !kid.startsWith("did:plc:")) throw new Error("unspported did method");
	return { key: await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: crv }, false, ["sign"]), kid };
}

/**
 * Import a public JWK object and return a usable CryptoKey for verification.
 *
 * @param jwk - Public JWK object (must not include private field `d`).
 * @param kid - Key identifier (DID with fragment) to associate with the key.
 * @returns An object with the imported verification CryptoKey and its `kid`.
 * @throws Error when the JWK is invalid or does not meet the constraints.
 */
export async function importPublicJwk(jwk: object, kid: string): Promise<CryptoKeyWithKid> {
	const { kty, crv, alg, d, x, y } = jwk as JsonWebKey;
	if (kty !== "EC") throw new Error("kty must be EC");
	if (x == null || y == null) throw new Error("invalid key");
	if (!crv) throw new Error("crv is required");
	if (d != null) throw new Error("private key not allowed");
	if (alg != null && alg !== "ES512") throw new Error(`only support ES512`);
	if (crv !== "P-521") throw new Error(`only support P-521`);
	return {
		key: await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: crv }, false, ["verify"]),
		kid,
	};
}

/**
 * Sign an HTTP request using the project's signature scheme.
 *
 * This function builds signature parameters, computes the signature over the
 * canonical data, and returns both the Signature-Input and Signature header values.
 *
 * @param req - Request object to sign; URL and Content-Digest are used to construct the signing data.
 * @param keyWithKid - Imported private key and its kid.
 * @param digest - Value of the Content-Digest header for the request.
 * @returns An object containing `Signature-Input` and `Signature` header values.
 */
export async function signRequest(
	req: Request,
	{ key, kid }: CryptoKeyWithKid,
	digest: string,
): Promise<{ "Signature-Input": string; Signature: string }> {
	const sigParams = `("@target-uri" "content-digest");created=${Math.floor(Date.now() / 1000)};keyid="${kid}"`;
	const data = generateData(getURL(req), digest, sigParams);
	const signed = await crypto.subtle.sign({ name: "ECDSA", hash: { name: "SHA-512" } }, key, Buffer.from(data));
	const signature = Buffer.from(signed).toString("base64");
	return { "Signature-Input": `pushat=${sigParams}`, Signature: `pushat=:${signature}:` };
}

/**
 * Verify a signed request produced by `signRequest`.
 *
 * This function expects the Content-Digest header to be validated before calling.
 * It parses `Signature-Input` and `Signature`, retrieves the public key using
 * the provided `getPubKey` callback, checks freshness (5 minutes), and verifies
 * the signature using ES512 (ECDSA with SHA-512).
 *
 * @param req - Incoming Request to verify.
 * @param getPubKey - Callback that returns the public key (CryptoKeyWithKid) for a given kid.
 * @returns `{ ok: true, kid }` on success, or `{ ok: false, error }` on failure.
 */
export async function verifyRequest(
	req: Request,
	getPubKey: (kid: string) => Promise<CryptoKeyWithKid>,
): Promise<{ ok: true; kid: string } | { ok: false; error: string }> {
	const sigInput = getHeader(req, "Signature-Input", true);
	if (sigInput == null) return { ok: false, error: "Signature-Input header required" };
	const signatureRaw = getHeader(req, "Signature", true);
	if (signatureRaw == null) return { ok: false, error: "Signature header required" };
	const signature = /^pushat=:(.*):$/.exec(signatureRaw)?.[1];
	if (signature == null) return { ok: false, error: "invalid Signature header" };
	if (signature.includes(":") || signature.includes(","))
		return { ok: false, error: "invalid signature header: multiple signature is not supported" };
	const inputMatch =
		/^pushat=(\("@target-uri" "content-digest"\);created=(\d+);keyid="(did:[a-z0-9]+:[a-zA-Z0-9.-]+#[a-zA-Z0-9]+)")$/.exec(
			sigInput,
		);
	if (inputMatch == null) return { ok: false, error: "invalid Signature-Input header" };
	const [_, sigParams, createdStr, kid] = inputMatch;
	const keys = await getPubKey(kid);
	if (kid !== keys?.kid) return { ok: false, error: "kid mismatch" };
	if (Date.now() / 1000 - Number.parseInt(createdStr, 10) > 5 * 60) return { ok: false, error: "old signature" };
	const data = generateData(getURL(req), getHeader(req, "Content-Digest"), sigParams);
	const result = await crypto.subtle.verify(
		{ name: "ECDSA", hash: { name: "SHA-512" } },
		keys.key,
		Buffer.from(signature, "base64"),
		Buffer.from(data),
	);
	if (result !== true) return { ok: false, error: "verify failed" };
	return { ok: true, kid };
}
/**get Content-Digest header */
function getHeader(req: Request, name: string): string;
function getHeader(req: Request, name: string, allowNull: true): string | null;
function getHeader(req: Request, name: string, allowNull: false): string;
function getHeader(req: Request, name: string, allowNull = false) {
	const digestHeader = req.headers.get(name) ?? req.headers.get(name.toLowerCase());
	if (digestHeader == null) {
		if (allowNull) return null;
		throw new Error(`${name} header required`);
	}
	return digestHeader;
}
function getURL(req: Request, base?: string) {
	return new URL(req.url, base).toString();
}
function generateData(url: string, digest: string, sigParams: string): Buffer {
	const sigParam = [`"@target-uri": ${url}`, `"content-digest": ${digest}`, `"@signature-params": ${sigParams}`];
	return Buffer.from(sigParam.join("\n"));
}
