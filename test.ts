import { importPrivateJwkStr } from "./lib/src/signature";

async function main() {
	const { privateKey, publicKey } = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-521" }, true, [
		"sign",
		"verify",
	]);
	const privKeyJwk = await crypto.subtle.exportKey("jwk", privateKey);
	const privJwkStr = JSON.stringify({ ...privKeyJwk, kid: "did:web:example.com#pushat" });
	console.log(privJwkStr);
	const privKey2 = await importPrivateJwkStr(privJwkStr);
	const pubJwk=await crypto.subtle.exportKey("jwk",publicKey)
    console.log(pubJwk)
    const didDoc=genDidDoc("did:web:example.com",pubJwk)
    console.log(JSON.stringify(didDoc));
    (await import("fs")).writeFileSync("did.json",JSON.stringify(didDoc,undefined,2))
}
function genDidDoc(did: string,jwk:JsonWebKey) {
    if(jwk.d!=null)throw new Error("private key not allowed")
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
main();
