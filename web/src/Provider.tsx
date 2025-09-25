import type { BrowserOAuthClient, OAuthSession } from "@atproto/oauth-client-browser";
import { createContext, type PropsWithChildren, useContext } from "react";
import type { AtpBaseClient } from "./lexicons";

const ClientContext = createContext<BrowserOAuthClient>(null!);
const AgentSessionContext = createContext<{ agent: AtpBaseClient; session: OAuthSession } | null>(null);
export function useClient() {
	return useContext(ClientContext);
}
export function useAgent() {
	return useContext(AgentSessionContext)?.agent ?? null;
}
export function useSession() {
	return useContext(AgentSessionContext)?.session ?? null;
}
export function useAgentSession() {
	return useContext(AgentSessionContext);
}

export function Provider({
	children,
	client,
	agentSession,
}: PropsWithChildren<{
	client: BrowserOAuthClient;
	agentSession: { agent: AtpBaseClient; session: OAuthSession } | null;
}>) {
	return (
		<ClientContext value={client}>
			<AgentSessionContext value={agentSession}>{children}</AgentSessionContext>
		</ClientContext>
	);
}
