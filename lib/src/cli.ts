import {defineCommand} from "citty"
import fs from "fs"

const main=defineCommand({
	meta:{
		name:"generate key for pushat"
	},args:{
		keyOut:{type:"string",alias:"-k",description:"output file path for private key jwk",default:"./private.jwk"},
		didOut:{type:"string",alias:"-d",description:"output file path for did document",default:"./did.json"},
	},run:async ({args})=>{
		const { privateKey, publicKey } = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-521" }, true, [
		"sign",
		"verify",
	]);
	const privKeyJwk = await crypto.subtle.exportKey("jwk", privateKey);
	const privJwkStr = JSON.stringify({ ...privKeyJwk, kid: "did:web:example.com#pushat" });
	fs.writeFileSync(args.keyOut,privJwkStr)
	const pubJwk=await crypto.subtle.exportKey("jwk",publicKey)
    const didDoc=genDidDoc("did:web:example.com",pubJwk)
    fs.writeFileSync(args.didOut,JSON.stringify(didDoc,undefined,2))
	}
})

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