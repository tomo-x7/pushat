import { DidResolver as DidValidator, getHandle, getKey, getPds } from "@atproto/identity";
import { DidResolver, HandleResolver } from "@tomo-x/resolvers";

const didResolver = new DidResolver();
const didValidator = new DidValidator({});
const handleResolver = new HandleResolver("https://public.api.bsky.app");
export async function getDidDoc(did: string) {
	const rawdoc = await didResolver.resolve(did);
	const rawDoc = didValidator.validateDidDoc(did, rawdoc);
	const handle = getHandle(rawDoc);
	const key = getKey(rawDoc);
	const pds = getPds(rawDoc);
	if (key == null) return null;
	return {
		did,
		handle,
		key,
		rawDoc,
		pds,
	};
}
