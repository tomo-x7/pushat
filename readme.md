atproto汎用プッシュサーバー PushAt

送信する側のサービスを以下requesterと呼びます。
事前準備
requesterは署名用の秘密鍵を生成して、公開鍵をDID Docの`authentication`に公開する必要があります。
制約
以下の制約は今後の実装に応じて(主に緩くなる方向に)変化する可能性があります。強い理由がない限り互換性は担保されます。各RFCへの準拠度を上げる貢献は歓迎されます。
- DID Docに公開鍵を含めるときの形式は`JsonWebKey2020`である必要があります。
- ダイジェストはRFC9530ベースで行います。
- 署名はRFC9421ベースで行いますが、署名ベースは以下のものしか許可されません。
```
("@target-uri" "content-digest");created=1618884473;keyid="did:web:example.com#pushat"
```
- 署名パラメーターは`created`と`keyid`がこの順で必要です。またそれ以外は許可されません。
- 複数のダイジェストや複数の署名は許可されません。
- 署名に利用する鍵は`P-521`曲線の`ECDSA`である必要があります。
- ダイジェストのハッシュアルゴリズムは`SHA-512`である必要があります。

許可の作成
requesterは送信対象のユーザーのリポジトリにrequesterのDIDをキーとして`win.tomo-x.pushat.allow`レコードを作成します。(この操作はユーザーの明示的な同意の後に行うことを推奨)
SDKを使う例
```TS
import { PushatRequesterClient } from "@tomo-x/pushat";

const requesterClient=new PushatRequesterClient(session,"did:web:pushat-test.example");
allowButton.onclick = () => {
	await requesterClient.allow();
}
```
通知の送信
`win.tomo-x.pushat.pushNotify`への署名付きリクエストによって行います。リクエストの内容についてはlexiconを参照してください。ダイジェストの計算と署名については上記の制約を参照してください。
SDKを使う例
```TS
import { PushatRequester } from "@tomo-x/pushat";

const requester=await PushatRequester.create({
	PrivateJwkStr: process.env.PRIVATE_KEY!,
	serviceDid: "did:web:pushat-test.example",
});
await requester.push(
	"did:web:test-user.example",
	{ title: "test", body: "hogehoge", icon: "https://pushat-test.example/icon.png" },
);
```