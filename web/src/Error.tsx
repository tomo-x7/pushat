import type { PropsWithChildren } from "react";
import { ErrorBoundary as LibErrorBoundary } from "react-error-boundary";

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
	return <div>Push not supported</div>;
}
function ServiceWorkerNotSupported() {
	return <div>Service Worker not supported</div>;
}
function GeneralError({ error }: { error: Error }) {
	console.error(error);
	return (
		<div>
			{error.name}: {error.message}
		</div>
	);
}
function UnknownError({ error }: { error: unknown }) {
	console.error(error);
	try {
		return <div>unknown error {JSON.stringify(error)}</div>;
	} catch {}
	return <div>unknown error {String(error)}</div>;
}
