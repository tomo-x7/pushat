import type { PropsWithChildren } from "react";
import { ErrorBoundary as LibErrorBoundary } from "react-error-boundary";
import { FiAlertTriangle, FiRefreshCw, FiWifi } from "react-icons/fi";

// カスタムエラー
export class MessagingNotSupportedError extends Error {}
export class ServiceWorkerNotSupportedError extends Error {}

export function ErrorBoundary({ children }: PropsWithChildren) {
	return <LibErrorBoundary fallbackRender={Fallback}>{children}</LibErrorBoundary>;
}

function Fallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
	if (error instanceof MessagingNotSupportedError) return <MessagingNotSupported />;
	if (error instanceof ServiceWorkerNotSupportedError) return <ServiceWorkerNotSupported />;
	if (error instanceof Error) return <GeneralError error={error} />;
	return <UnknownError error={error} />;
}

function MessagingNotSupported() {
	return (
		<div className="full-center">
			<div className="card">
				<div className="card-body text-center">
					<FiWifi size={48} className="text-red-600 mb-4 mx-auto" />
					<h2 className="text-lg font-semibold mb-2">プッシュ通知がサポートされていません</h2>
					<p className="text-gray-600 text-sm">
						お使いのブラウザまたはデバイスはプッシュ通知に対応していません。
					</p>
				</div>
			</div>
		</div>
	);
}

function ServiceWorkerNotSupported() {
	return (
		<div className="full-center">
			<div className="card">
				<div className="card-body text-center">
					<FiWifi size={48} className="text-red-600 mb-4 mx-auto" />
					<h2 className="text-lg font-semibold mb-2">Service Workerがサポートされていません</h2>
					<p className="text-gray-600 text-sm">お使いのブラウザはService Workerに対応していません。</p>
				</div>
			</div>
		</div>
	);
}
function GeneralError({ error }: { error: Error }) {
	console.error(error);
	const reload = () => window.location.reload();

	return (
		<div className="full-center">
			<div className="card">
				<div className="card-body text-center">
					<FiAlertTriangle size={48} className="text-red-600 mb-4 mx-auto" />
					<h2 className="text-lg font-semibold mb-2">エラーが発生しました</h2>
					<p className="text-gray-600 text-sm mb-4">{error.message || "予期しないエラーが発生しました"}</p>
					<button type="button" onClick={reload} className="btn btn-primary">
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
			<div className="full-center">
				<div className="card">
					<div className="card-body text-center">
						<FiAlertTriangle size={48} className="text-red-600 mb-4 mx-auto" />
						<h2 className="text-lg font-semibold mb-2">不明なエラー</h2>
						<p className="text-gray-600 text-sm mb-4">{JSON.stringify(error)}</p>
						<button type="button" onClick={reload} className="btn btn-primary">
							<FiRefreshCw size={16} />
							再読み込み
						</button>
					</div>
				</div>
			</div>
		);
	} catch {
		return (
			<div className="full-center">
				<div className="card">
					<div className="card-body text-center">
						<FiAlertTriangle size={48} className="text-red-600 mb-4 mx-auto" />
						<h2 className="text-lg font-semibold mb-2">不明なエラー</h2>
						<p className="text-gray-600 text-sm mb-4">{String(error)}</p>
						<button type="button" onClick={reload} className="btn btn-primary">
							<FiRefreshCw size={16} />
							再読み込み
						</button>
					</div>
				</div>
			</div>
		);
	}
}
