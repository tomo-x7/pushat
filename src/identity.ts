import { DidResolver, getHandle, getKey, HandleResolver, MemoryCache } from "@atproto/identity";

const didResolver = new DidResolver({ didCache: new MemoryCache() });
const handleResolver = new HandleResolver({});
export async function getDidDoc(did: string) {
	const rawdoc = await didResolver.resolve(did);
	const doc = didResolver.validateDidDoc(did, rawdoc);
	const handle = getHandle(doc);
	const key = getKey(doc);
	if (key == null) return null;
	return {
		did,
		handle,
		key,
		doc,
	};
}
