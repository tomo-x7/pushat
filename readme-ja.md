# PushAt — atproto汎用プッシュサーバー
atprotoサービス向けの汎用プッシュサーバー実装です。

[English version](./readme.md)

## 目次
- [用語](#用語)
- [事前準備](#事前準備)
- [制約](#制約)
- [許可の付与](#許可の付与)
- [通知の送信](#通知の送信)

## 用語
- 送信する側のサービスを以下では「requester」と呼びます。

## 事前準備
requesterは署名用の秘密鍵を生成して、公開鍵をDID Documentの`authentication`に公開する必要があります。

### CLI（SDK付属）の例
```sh
pushat-gen did:web:pushat-text.example
```

## 制約
以下は主に実装コスト上の制約です。今後の実装に応じて（主に緩和される方向で）変更される可能性があります。強い理由がない限り互換性は担保されます。各RFCへの準拠度を上げる貢献は歓迎します。

- DID Documentに公開鍵を含めるときの形式は `JsonWebKey2020` である必要があります。
- ダイジェストは RFC9530 ベースで行います。
- 署名は RFC9421 ベースで行いますが、署名ベースは以下のものしか許可されません。

```text
("@target-uri" "content-digest");created=1618884473;keyid="did:web:example.com#pushat"
```

- 署名パラメーターは `created` と `keyid` がこの順で必要です（それ以外は許可されません）。
- 複数のダイジェストや複数の署名は許可されません。
- 署名アルゴリズムは ES512（ECDSA on curve P-521, ハッシュは SHA-512）を使用します。
- ダイジェストのハッシュアルゴリズムは `SHA-512` である必要があります。

## 許可の付与
requester は送信対象のユーザーのリポジトリに requester の DID をキーとして `win.tomo-x.pushat.allow` レコードを作成します。
（この操作はユーザーの明示的な同意の後に行うことを推奨します）

### SDK を使った例
```ts
import { PushatRequesterClient } from "@tomo-x/pushat";

const requesterClient = new PushatRequesterClient(session, "did:web:pushat-test.example");
allowButton.onclick = () => {
	await requesterClient.allow();
}
```

## 通知の送信
通知は `win.tomo-x.pushat.pushNotify` への署名付きリクエストによって行います。リクエストの詳細については lexicon を参照してください。ダイジェストの計算と署名については上記の制約を参照してください。

### SDK を使った例
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