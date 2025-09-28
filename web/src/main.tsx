import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ATPProvider } from "./atproto";
import { ErrorBoundary } from "./Error";
import { FcmBaseProvider, FcmTokenProvider } from "./fcm";
import { Toaster } from "react-hot-toast";

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
		</ErrorBoundary>
	</StrictMode>,
);
