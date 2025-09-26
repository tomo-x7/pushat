import { BrowserOAuthClient, type OAuthSession } from "@atproto/oauth-client-browser";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { AtpBaseClient } from "./lexicons/index.ts";
import { Provider } from "./Provider.tsx";

const client = await BrowserOAuthClient.load({
	clientId: "https://pushat.tomo-x.win/client-metadata.json",
	handleResolver: "https://public.api.bsky.app/",
});
const res = await client.init();
console.log(res);
const agentSession = ((session: OAuthSession | undefined) => {
	if (session == null) return null;
	const agent = new AtpBaseClient(session.fetchHandler);
	return { agent, session };
})(res?.session);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider client={client} agentSession={agentSession}>
			<App />
		</Provider>
	</StrictMode>,
);
