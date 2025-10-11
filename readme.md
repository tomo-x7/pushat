# PushAt — Generic atproto Push Server
This repository provides a generic push server implementation for atproto services.

[日本語版 (Japanese)](./readme-ja.md)

## Contents
- [Terminology](#terminology)
- [Prerequisites](#prerequisites)
- [Constraints](#constraints)
- [Granting permission (Allow)](#granting-permission-allow)
- [Sending a Notification](#sending-a-notification)

## Terminology
- The sending service is referred to as the "requester" below.

## Prerequisites
The requester must generate a private key for signing and publish the corresponding public key in the DID Document's `authentication` field.

### CLI (included with the SDK) example
```sh
pushat-gen did:web:pushat-text.example
```

## Constraints
The following constraints are primarily due to implementation cost. They may be relaxed in the future as the project evolves. Contributions that increase RFC compliance are welcome.

- The public key included in the DID Document must use the `JsonWebKey2020` format.
- Content digests are computed according to RFC9530.
- Signatures follow RFC9421, but only the signature parameter form below is allowed:

```text
("@target-uri" "content-digest");created=1618884473;keyid="did:web:example.com#pushat"
```

- The signature parameters must include `created` and `keyid` in that order (no other parameters are allowed).
- Multiple digests or multiple signatures are not permitted.
- The signature algorithm used is ES512 (ECDSA on curve P-521 with SHA-512).
- The digest hash algorithm must be `SHA-512`.

## Granting permission (Allow)
The requester creates a `win.tomo-x.pushat.allow` record in the recipient user's repository, using the requester's DID as the key.
(This operation is recommended only after explicit consent from the user.)

### SDK example
```ts
import { PushatRequesterClient } from "@tomo-x/pushat";

const requesterClient = new PushatRequesterClient(session, "did:web:pushat-test.example");
allowButton.onclick = () => {
	await requesterClient.allow();
}
```

## Sending a Notification
Notifications are sent via a signed request to `win.tomo-x.pushat.pushNotify`. See the lexicon for request details. Refer to the Constraints section above for digest calculation and signing requirements.

### SDK example
```ts
import { PushatRequester } from "@tomo-x/pushat";

const requester = await PushatRequester.create({
	PrivateJwkStr: process.env.PRIVATE_KEY!,
	serviceDid: "did:web:pushat-test.example",
});
await requester.push(
	"did:web:test-user.example",
	{ title: "test", body: "hogehoge", icon: "https://pushat-test.example/icon.png" },
);
```