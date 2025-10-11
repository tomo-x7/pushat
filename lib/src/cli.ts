#! /usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { defineCommand, runMain } from "citty";

const main = defineCommand({
	meta: {
		name: "generate key for pushat",
	},
	args: {
		keyOut: {
			type: "string",
			alias: "-k",
			description: "output file path for private key jwk",
			default: "./private.jwk",
		},
		didOut: {
			type: "string",
			alias: "-d",
			description: "output file path for did document",
			default: "./did.json",
		},
		did: { type: "positional", description: "service did", required: true },
	},
	run: async ({ args }) => {
		const { privateKey, publicKey } = await crypto.subtle.generateKey(
			{ name: "ECDSA", namedCurve: "P-521" },
			true,
			["sign", "verify"],
		);
		const privKeyJwk = await crypto.subtle.exportKey("jwk", privateKey);
		const privJwkStr = JSON.stringify({ ...privKeyJwk, kid: `${args.did}#pushat` });
		fs.mkdirSync(path.dirname(args.keyOut), { recursive: true });
		fs.writeFileSync(args.keyOut, privJwkStr);
		const pubJwk = await crypto.subtle.exportKey("jwk", publicKey);
		const didDoc = genDidDoc(args.did, pubJwk);
		fs.mkdirSync(path.dirname(args.didOut), { recursive: true });
		fs.writeFileSync(args.didOut, JSON.stringify(didDoc, undefined, 2));
	},
});
runMain(main);

/**
 * Generate a minimal DID Document containing a JsonWebKey2020 verification method.
 *
 * @param did - DID string for the service (e.g. "did:web:example.com").
 * @param jwk - Public JWK object produced by WebCrypto export.
 * @returns A DID Document object ready to be written to disk.
 */
function genDidDoc(did: string, jwk: JsonWebKey) {
	if (jwk.d != null) throw new Error("private key not allowed");
	return {
		"@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/jws-2020/v1"],
		id: did,
		verificationMethod: [
			{
				id: `${did}#pushat`,
				type: "JsonWebKey2020",
				controller: did,
				publicKeyJwk: jwk,
			},
		],
		authentication: [`${did}#pushat`],
	};
}
