import { Buffer } from "buffer";

export function toBuffer(input: string | ArrayBuffer | Buffer | Uint8Array | SharedArrayBuffer): Buffer {
	if (input instanceof Buffer) return input;
	if (typeof input === "string") return Buffer.from(input);
	if (input instanceof ArrayBuffer || input instanceof SharedArrayBuffer) return Buffer.from(new Uint8Array(input));
	if (input instanceof Uint8Array) return Buffer.from(input);
	throw new Error("Unsupported input type");
}
