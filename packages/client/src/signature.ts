import { Buffer } from "buffer";
import { toBuffer } from "./util.js";

type a = EcdsaParams;

export async function importJwk(jwkStr:string):Promise<CryptoKey> {
	const jwk = JSON.parse(jwkStr);
	const {kty,crv,alg,d,x,y}=jwk as JsonWebKey
	if(kty!=="EC") throw new Error("kty must be EC");
	if(x==null||y==null) throw new Error("invalid key");
	if(!crv) throw new Error("crv is required");
	if(d==null) throw new Error("private key required");
	return crypto.subtle.importKey("jwk",jwk,{name:"ECDSA",namedCurve:crv},false,["sign"]);
}

/**ECDSA only */
export async function signRequest(req: Request, key: CryptoKey) {
	const data = await generateData(req);
	await crypto.subtle.sign({ name: "ECDSA", hash: { name: "SHA-512" } }, key, data);
}

async function generateData(req: Request, urlBase?: string): Promise<Buffer> {
	const bodyBuf = toBuffer(await req.clone().arrayBuffer());
	const urlBuf = Buffer.from(new URL(req.url, urlBase).toString());
	return Buffer.concat([bodyBuf, urlBuf]);
}
