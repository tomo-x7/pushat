import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { App } from "./App";
import { ATPProvider } from "./atproto";
import { TopLevelErrorBoundary } from "./Error";
import { FcmBaseProvider, FcmTokenProvider } from "./fcm";
import { CallInnerRoot, CallRoot } from "./Modal";
import "./globals.css";
import "./i18n";

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
		<TopLevelErrorBoundary>
			<FcmBaseProvider>
				<ATPProvider>
					<FcmTokenProvider>
						<App />
						<CallInnerRoot />
					</FcmTokenProvider>
				</ATPProvider>
			</FcmBaseProvider>
			<CallRoot />
			<Toaster position="top-right" />
		</TopLevelErrorBoundary>
	</StrictMode>,
);
