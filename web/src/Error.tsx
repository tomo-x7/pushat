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
		<div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
				<div className="text-center">
					<FiAlertTriangle size={48} className="text-warning-600 mx-auto mb-4" />
					<h2 className="text-xl font-bold text-neutral-900 mb-3">{t("notification.notSupported")}</h2>
					<p className="text-neutral-700 mb-6">{t("notification.notSupportedDescription")}</p>
					<div className="bg-neutral-50 rounded-lg p-4 text-left space-y-2">
						<p className="font-semibold text-neutral-900 mb-3">{t("notification.pwaInstallTitle")}</p>
						<button
							type="button"
							onClick={() => setOpenIos((b) => !b)}
							className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 transition-colors font-medium text-neutral-800"
						>
							▶ {t("notification.ios")}
						</button>
						{openIos && (
							<div className="ml-6 p-3 bg-white rounded-md text-sm text-neutral-700 border border-neutral-200">
								{t("notification.iosInstall")}
							</div>
						)}
						<button
							type="button"
							onClick={() => setOpenAndroid((b) => !b)}
							className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 transition-colors font-medium text-neutral-800"
						>
							▶ {t("notification.android")}
						</button>
						{openAndroid && (
							<div className="ml-6 p-3 bg-white rounded-md text-sm text-neutral-700 border border-neutral-200">
								{t("notification.androidInstall")}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function ServiceWorkerNotSupported() {
	const { t } = useTranslation();
	return (
		<div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
				<FiAlertTriangle size={48} className="text-warning-600 mx-auto mb-4" />
				<h2 className="text-xl font-bold text-neutral-900 mb-3">{t("notification.swNotSupported")}</h2>
				<p className="text-neutral-700">{t("notification.swNotSupportedDescription")}</p>
			</div>
		</div>
	);
}
function NormalError({ error }: { error: Error }) {
	const { t } = useTranslation();
	console.error(error);
	const reload = () => window.location.reload();

	return (
		<div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
				<FiAlertTriangle size={48} className="text-danger-600 mx-auto mb-4" />
				<h2 className="text-xl font-bold text-neutral-900 mb-3">{t("error.occurred")}</h2>
				<p className="text-neutral-700 mb-6 break-words">{error.message || t("error.unexpected")}</p>
				<button
					type="button"
					onClick={reload}
					className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
				>
					<FiRefreshCw size={16} />
					{t("error.reload")}
				</button>
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
			<div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
				<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
					<FiAlertTriangle size={48} className="text-danger-600 mx-auto mb-4" />
					<h2 className="text-xl font-bold text-neutral-900 mb-3">{t("error.unknown")}</h2>
					<p className="text-sm text-neutral-700 mb-6 break-all font-mono bg-neutral-50 p-3 rounded-md max-h-40 overflow-auto">
						{JSON.stringify(error)}
					</p>
					<button
						type="button"
						onClick={reload}
						className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
					>
						<FiRefreshCw size={16} />
						{t("error.reload")}
					</button>
				</div>
			</div>
		);
	} catch {
		return (
			<div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
				<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
					<FiAlertTriangle size={48} className="text-danger-600 mx-auto mb-4" />
					<h2 className="text-xl font-bold text-neutral-900 mb-3">{t("error.unknown")}</h2>
					<p className="text-sm text-neutral-700 mb-6 break-all font-mono bg-neutral-50 p-3 rounded-md max-h-40 overflow-auto">
						{String(error)}
					</p>
					<button
						type="button"
						onClick={reload}
						className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
					>
						<FiRefreshCw size={16} />
						{t("error.reload")}
					</button>
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
