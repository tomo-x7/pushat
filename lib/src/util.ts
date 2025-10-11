import { Buffer } from "buffer";

/**
 * Convert various input types to a Node.js Buffer.
 *
 * Supported input types: string, ArrayBuffer, SharedArrayBuffer, Uint8Array, Buffer.
 *
 * @param input - The data to convert.
 * @returns A Buffer instance containing the input bytes.
 * @throws Error if the input type is not supported.
 */
export function toBuffer(input: string | ArrayBuffer | Buffer | Uint8Array | SharedArrayBuffer): Buffer {
	if (input instanceof Buffer) return input;
	if (typeof input === "string") return Buffer.from(input);
	if (input instanceof ArrayBuffer || input instanceof SharedArrayBuffer) return Buffer.from(new Uint8Array(input));
	if (input instanceof Uint8Array) return Buffer.from(input);
	throw new Error("Unsupported input type");
}
