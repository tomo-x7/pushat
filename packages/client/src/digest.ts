import { Buffer } from "buffer";
import { toBuffer } from "./util.js";

/**
 * SHA-512 only
 * @returns base64 encoded
 */
export async function generateContentDigest(input: ArrayBufferLike | Buffer) {
	const buf = toBuffer(input);
	return await crypto.subtle.digest("SHA-512", buf).then((hash) => Buffer.from(hash).toString("base64"));
}
