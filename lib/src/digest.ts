import { Buffer } from "buffer";
import { toBuffer } from "./util.js";

/**
 * SHA-512 only
 * @returns base64 encoded
 */
async function generateContentDigest(input: ArrayBufferLike | Buffer) {
	const buf = toBuffer(input);
	return await crypto.subtle.digest("SHA-512", Buffer.from(buf)).then((hash) => Buffer.from(hash).toString("base64"));
}
/**
 * SHA-512 only
 * @returns value of Content-Digest header
 */
export async function getContentDigest(req: Request): Promise<string> {
	const data = await req.clone().arrayBuffer();
	const digest = await generateContentDigest(data);
	return `sha-512=:${digest}:`;
}
/**
 * SHA-512 only
 * validate content digest header
 */
export async function validateContentDigest(req: Request): Promise<true | string> {
	const headerValue = req.headers.get("Content-Digest") ?? req.headers.get("content-digest");
	if (headerValue == null) return "Content-Digest header required";
	const match = headerValue.match(/^sha-512=:([a-zA-Z0-9+/=]+):$/);
	if (match == null || match[1] == null)
		return "invalid Content-Digest header: multiple digest is not supported and sha-512 only.";
	const digest1 = match[1];
	const digest2 = await generateContentDigest(await req.clone().arrayBuffer());
	if (digest1 !== digest2) return "invalid Content-Digest header: digest not match";
	return true;
}
