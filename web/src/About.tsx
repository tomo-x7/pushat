import { updateSw } from "./fcm";

export function About({ hiddenFooter }: { hiddenFooter?: boolean }) {
	return (
		<>
			<div>
				PushAtは、atprotoサービス向けの汎用プッシュ通知サービスです。
				PushAtにデバイスを登録すれば、対応サービスからのプッシュ通知を簡単に受け取ることができます。
			</div>
			<div>
				<a href="https://github.com/tomo-x7/pushat">開発者向けドキュメント</a>
			</div>
			{!hiddenFooter && (
				<div>
					<div>
						2025{" "}
						<a
							href="https://bsky.app/profile/did:plc:qcwvyds5tixmcwkwrg3hxgxd"
							target="_blank"
							rel="noopener noreferrer"
						>
							tomo-x
						</a>
					</div>
					<div>
						<button type="button" onClick={updateSw}>
							更新を確認
						</button>
					</div>
				</div>
			)}
		</>
	);
}
