import { BrowserOAuthClient, type OAuthSession } from "@atproto/oauth-client-browser";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { AtpBaseClient } from "./lexicons/index.ts";
import { Provider } from "./Provider.tsx";

(() => {
	var src = "//cdn.jsdelivr.net/npm/eruda";
	if (!/eruda=true/.test(window.location.href) && localStorage.getItem("active-eruda") !== "true") return;
	document.write("<scr" + 'ipt src="' + src + '"></scr' + "ipt>");
	document.write("<scr" + "ipt>eruda.init();</scr" + "ipt>");
})();

const client = await BrowserOAuthClient.load({ clientId: "https://pushat.tomo-x.win/client-metadata.json" });
const res = await client.init();
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
