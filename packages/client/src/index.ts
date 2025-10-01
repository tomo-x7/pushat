import { Buffer } from "buffer";

/**
 * SHA-512 only
 * @returns base64 encoded
 */
export async function generateContentDigest(input: ArrayBuffer | Buffer) {
	const buf = input instanceof Buffer ? input : Buffer.from(input);
	return await crypto.subtle.digest("SHA-512", buf).then((hash) => Buffer.from(hash).toString("base64"));
}
