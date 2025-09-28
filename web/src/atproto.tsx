import { BrowserOAuthClient, type OAuthSession } from "@atproto/oauth-client-browser";
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Loading } from "./Loading";
import { AtpBaseClient } from "./lexicons";

const ClientContext = createContext<BrowserOAuthClient>(null!);
const AgentSessionContext = createContext<{ agent: AtpBaseClient; session: OAuthSession }>(null!);
export function useClient() {
	return useContext(ClientContext);
}
export function useAgent() {
	return useContext(AgentSessionContext).agent;
}
export function useSession() {
	return useContext(AgentSessionContext).session;
}

export function ATPProvider({ children }: PropsWithChildren) {
	const { showBoundary } = useErrorBoundary();
	const [client, setClient] = useState<BrowserOAuthClient | null>(null);
	const [session, setSession] = useState<OAuthSession | null>(null);
	const agent = useMemo(() => {
		if (session == null) return null;
		const agent = new AtpBaseClient((...params) => session.fetchHandler(...params));
		agent.setHeader("atproto-proxy", "did:web:pushat.tomo-x.win#pushat");
		return agent;
	}, [session]);
	useEffect(() => {
		BrowserOAuthClient.load({
			clientId: "https://pushat.tomo-x.win/client-metadata.json",
			handleResolver: "https://public.api.bsky.app/",
		})
			.then(async (client) => ({ client, res: await client.init() }))
			.then(({ client, res }) => {
				setClient(client);
				if (res?.session != null) setSession(res.session);
			})
			.catch(showBoundary);
		return () => {
			setClient(null);
			setSession(null);
		};
	}, [showBoundary]);
	if (client == null) return <Loading />;
	if (session == null || agent == null) return <LoginScreen client={client} />;
	return (
		<ClientContext value={client}>
			<AgentSessionContext value={{ agent, session }}>{children}</AgentSessionContext>
		</ClientContext>
	);
}

function LoginScreen({ client }: { client: BrowserOAuthClient }) {
	const login = async () => {
		const handle = window.prompt("enter your handle");
		if (!handle) return;
		await client.signIn(handle, {
			ui_locales: "ja",
		});
	};
	return (
		<button type="button" onClick={login}>
			login
		</button>
	);
}
