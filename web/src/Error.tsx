import { type PropsWithChildren, useState } from "react";
import { type FallbackProps, ErrorBoundary as LibErrorBoundary } from "react-error-boundary";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

// カスタムエラー
export class MessagingNotSupportedError extends Error {}
export class ServiceWorkerNotSupportedError extends Error {}

export function ErrorBoundary({ children }: PropsWithChildren) {
	return <LibErrorBoundary fallbackRender={Fallback}>{children}</LibErrorBoundary>;
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
	if (error instanceof MessagingNotSupportedError) return <MessagingNotSupported />;
	if (error instanceof ServiceWorkerNotSupportedError) return <ServiceWorkerNotSupported />;
	if (error instanceof Error) return <GeneralError error={error} />;
	return <UnknownError error={error} />;
}

function MessagingNotSupported() {
	const [openIos, setOpenIos] = useState(false);
	const [openAndroid, setOpenAndroid] = useState(false);
	return (
		<div>
			<div>
				<div>
					<h2>プッシュ通知がサポートされていません</h2>
					<div>
						お使いのブラウザまたはデバイスはプッシュ通知に対応していません。
						スマートフォンをご利用の場合、PWAをインストールする必要があります。
					</div>
					<br />
					<div>
						PWAのインストール方法
						<button type="button" onClick={() => setOpenIos((b) => !b)}>
							▶iOS
						</button>
						{openIos && (
							<div>Safariで開いた後共有ボタンをタップして、「ホーム画面に追加」を選択してください</div>
						)}
						<button type="button" onClick={() => setOpenAndroid((b) => !b)}>
							▶Android
						</button>
						{openAndroid && <div>Chromeのメニューから「ホーム画面に追加」を選択してください</div>}
					</div>
				</div>
			</div>
		</div>
	);
}

function ServiceWorkerNotSupported() {
	return (
		<div>
			<div>
				<div>
					<h2>Service Workerがサポートされていません</h2>
					<p>お使いのブラウザはService Workerに対応していません。</p>
				</div>
			</div>
		</div>
	);
}
function GeneralError({ error }: { error: Error }) {
	console.error(error);
	const reload = () => window.location.reload();

	return (
		<div>
			<div>
				<div>
					<FiAlertTriangle size={48} />
					<h2>エラーが発生しました</h2>
					<p>{error.message || "予期しないエラーが発生しました"}</p>
					<button type="button" onClick={reload}>
						<FiRefreshCw size={16} />
						再読み込み
					</button>
				</div>
			</div>
		</div>
	);
}
function UnknownError({ error }: { error: unknown }) {
	console.error(error);
	const reload = () => window.location.reload();

	try {
		return (
			<div>
				<div>
					<div>
						<FiAlertTriangle size={48} />
						<h2>不明なエラー</h2>
						<p>{JSON.stringify(error)}</p>
						<button type="button" onClick={reload}>
							<FiRefreshCw size={16} />
							再読み込み
						</button>
					</div>
				</div>
			</div>
		);
	} catch {
		return (
			<div>
				<div>
					<div>
						<FiAlertTriangle size={48} />
						<h2>不明なエラー</h2>
						<p>{String(error)}</p>
						<button type="button" onClick={reload}>
							<FiRefreshCw size={16} />
							再読み込み
						</button>
					</div>
				</div>
			</div>
		);
	}
}
