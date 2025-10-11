import { type PropsWithChildren, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

// カスタムエラー
export class MessagingNotSupportedError extends Error {}
export class ServiceWorkerNotSupportedError extends Error {}

export function TopLevelErrorBoundary({ children }: PropsWithChildren) {
	return <ErrorBoundary fallbackRender={Fallback}>{children}</ErrorBoundary>;
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
	if (error instanceof MessagingNotSupportedError) return <MessagingNotSupported />;
	if (error instanceof ServiceWorkerNotSupportedError) return <ServiceWorkerNotSupported />;
	if (error instanceof Error) return <NormalError error={error} />;
	return <UnknownError error={error} />;
}

function MessagingNotSupported() {
	const { t } = useTranslation();
	const [openIos, setOpenIos] = useState(false);
	const [openAndroid, setOpenAndroid] = useState(false);
	return (
		<div>
			<div>
				<div>
					<h2>{t("notification.notSupported")}</h2>
					<div>{t("notification.notSupportedDescription")}</div>
					<br />
					<div>
						{t("notification.pwaInstallTitle")}
						<button type="button" onClick={() => setOpenIos((b) => !b)}>
							▶{t("notification.ios")}
						</button>
						{openIos && <div>{t("notification.iosInstall")}</div>}
						<button type="button" onClick={() => setOpenAndroid((b) => !b)}>
							▶{t("notification.android")}
						</button>
						{openAndroid && <div>{t("notification.androidInstall")}</div>}
					</div>
				</div>
			</div>
		</div>
	);
}

function ServiceWorkerNotSupported() {
	const { t } = useTranslation();
	return (
		<div>
			<div>
				<div>
					<h2>{t("notification.swNotSupported")}</h2>
					<p>{t("notification.swNotSupportedDescription")}</p>
				</div>
			</div>
		</div>
	);
}
function NormalError({ error }: { error: Error }) {
	const { t } = useTranslation();
	console.error(error);
	const reload = () => window.location.reload();

	return (
		<div>
			<div>
				<div>
					<FiAlertTriangle size={48} />
					<h2>{t("error.occurred")}</h2>
					<p>{error.message || t("error.unexpected")}</p>
					<button type="button" onClick={reload}>
						<FiRefreshCw size={16} />
						{t("error.reload")}
					</button>
				</div>
			</div>
		</div>
	);
}
function UnknownError({ error }: { error: unknown }) {
	const { t } = useTranslation();
	console.error(error);
	const reload = () => window.location.reload();

	try {
		return (
			<div>
				<div>
					<div>
						<FiAlertTriangle size={48} />
						<h2>{t("error.unknown")}</h2>
						<p>{JSON.stringify(error)}</p>
						<button type="button" onClick={reload}>
							<FiRefreshCw size={16} />
							{t("error.reload")}
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
						<h2>{t("error.unknown")}</h2>
						<p>{String(error)}</p>
						<button type="button" onClick={reload}>
							<FiRefreshCw size={16} />
							{t("error.reload")}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export function GeneralErrorBoundary({ children }: PropsWithChildren) {
	return <ErrorBoundary fallbackRender={GeneralFallback}>{children}</ErrorBoundary>;
}
function GeneralFallback({ error, resetErrorBoundary }: FallbackProps) {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col items-center justify-center p-6 bg-danger-50 border border-danger-200 rounded-lg">
			<FiAlertTriangle size={32} className="text-danger-600 mb-3" />
			<p className="text-sm text-danger-800 text-center mb-4 font-medium">{String(error)}</p>
			<button
				type="button"
				onClick={resetErrorBoundary}
				className="flex items-center gap-2 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors font-medium text-sm"
			>
				<FiRefreshCw size={16} />
				{t("error.reload")}
			</button>
		</div>
	);
}
