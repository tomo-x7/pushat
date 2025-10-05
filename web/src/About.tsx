import { useCheckUpdateSw } from "./fcm";

export function About({ hiddenFooter }: { hiddenFooter?: boolean }) {
	const { latest, update, chackLatest } = useCheckUpdateSw();
	return (
		<div className="space-y-4">
			<p className="text-neutral-700 leading-relaxed">
				PushAtは、atprotoサービス向けの汎用プッシュ通知サービスです。
				PushAtにデバイスを登録すれば、対応サービスからのプッシュ通知を簡単に受け取ることができます。
			</p>
			<div>
				<a
					href="https://github.com/tomo-x7/pushat/blob/main/readme.md"
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary-600 hover:text-primary-700 underline transition-colors"
				>
					開発者向けドキュメント
				</a>
			</div>
			{!hiddenFooter && (
				<div className="mt-6 pt-4 border-t border-neutral-200 space-y-2">
					<div className="text-sm text-neutral-600">
						© 2025{" "}
						<a
							href="https://bsky.app/profile/did:plc:qcwvyds5tixmcwkwrg3hxgxd"
							target="_blank"
							rel="noopener noreferrer"
							className="text-neutral-600 hover:text-neutral-700 underline transition-colors"
						>
							tomo-x
						</a>
					</div>
					<div>
						<button
							type="button"
							onClick={latest ? chackLatest : update}
							className="text-sm text-neutral-600 hover:text-neutral-900 underline transition-colors"
						>
							{latest ? "更新を確認" : "更新する"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
