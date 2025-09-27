import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { ErrorBoundary } from "./Error.tsx";
import { InitLoad } from "./InitLoad.tsx";
import { Provider } from "./Provider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<InitLoad>
				{({ agentSession, client }) => (
					<Provider client={client} agentSession={agentSession}>
						<App />
					</Provider>
				)}
			</InitLoad>
		</ErrorBoundary>
	</StrictMode>,
);
