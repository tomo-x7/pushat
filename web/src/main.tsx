import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { App } from "./App";
import { ATPProvider } from "./atproto";
import { ErrorBoundary } from "./Error";
import { FcmBaseProvider, FcmTokenProvider } from "./fcm";
import { CallRoot } from "./Modal";
import "./globals.css";

if (new URL(location.href).searchParams.has("redirect")) {
	const rawurl = new URL(location.href).searchParams.get("redirect");
	if (rawurl != null) {
		const url = URL.canParse(rawurl)
			? new URL(rawurl)
			: URL.canParse(decodeURIComponent(rawurl))
				? new URL(decodeURIComponent(rawurl))
				: null;
		if (url != null && url.protocol === "https:") window.open(url, "_blank");
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<FcmBaseProvider>
				<ATPProvider>
					<FcmTokenProvider>
						<App />
					</FcmTokenProvider>
				</ATPProvider>
			</FcmBaseProvider>
			<Toaster position="top-right" />
			<CallRoot />
		</ErrorBoundary>
	</StrictMode>,
);
