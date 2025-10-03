import { Buffer } from "buffer";
import { toBuffer } from "./util.js";


export type CryptoKeyWithKid={
	key:CryptoKey
	kid:string
}
/**
 * ECDSA only
 * @param jwkStr private JWK
 * @returns CryptoKey
 */
export async function importJwk(jwkStr: string): Promise<CryptoKeyWithKid> {
	const jwk = JSON.parse(jwkStr);
	const { kty, crv, alg, d, x, y,kid } = jwk as JsonWebKey&{kid:string};
	if (kty !== "EC") throw new Error("kty must be EC");
	if (x == null || y == null) throw new Error("invalid key");
	if (!crv) throw new Error("crv is required");
	if (d == null) throw new Error("private key required");
	if(kid==null)throw new Error("kid required")
	if(/^did:[a-z0-9]+:[a-zA-Z0-9.]+#[a-zA-Z0-9]+$/.test(kid))throw new Error("invalid kid: kid must be did with fragment")
	if(!kid.startsWith("did:web:")||!kid.startsWith("did:plc:"))throw new Error("unspported did method")
	return {key:await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: crv }, false, ["sign"]),kid};
}

/**
 * ECDSA only
 * @returns {{"Signature-Input":string, "Signature":string}}
 */
export async function signRequest(
	req: Request,
	{key,kid}: CryptoKeyWithKid
): Promise<{ "Signature-Input": string; Signature: string }> {
	const sigInput=`pushat=("@target-uri" "content-digest");created=${new Date().valueOf()};keyid=${kid}`
	const data = await generateData(req);
	const signed=await crypto.subtle.sign({ name: "ECDSA", hash: { name: "SHA-512" } }, key, data);
	const Signature=Buffer.from(signed).toString("base64")
	return { "Signature-Input":sigInput , Signature };
}

async function generateData(req: Request, urlBase?: string): Promise<Buffer> {
	const bodyBuf = toBuffer(await req.clone().arrayBuffer());
	const url = (new URL(req.url, urlBase).toString());
	return Buffer.from()
}
