import { BrowserOAuthClient, type OAuthSession } from "@atproto/oauth-client-browser";
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-hot-toast";
import { Loading } from "./Loading";
import { AtpBaseClient } from "./lexicons";
import { showTextInput } from "./Modal";
import { IoAt } from "react-icons/io5";
import { useAsync } from "react-async-hook";

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
			<AgentSessionContext value={{ agent, session }}>
				<div>
					<Header did={session.did} />
					{children}
				</div>
			</AgentSessionContext>
		</ClientContext>
	);
}

function LoginScreen({ client }: { client: BrowserOAuthClient }) {
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	return (
		<div>
			<Header />
			<div>Blueskyアカウントでログイン</div>
			<button type="button" onClick={handleLogin(client, setIsLoggingIn)} disabled={isLoggingIn}>
				ログイン
			</button>
		</div>
	);
}

function Header({ did }: { did?: string }) {
	const avatar = useAsync<string>(async () => {
		if (!did) return;
		return await fetch(
			`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did)}`,
		)
			.then((res) => res.json())
			.then((res) => res.avatar);
	}, [did]);
	return (
		<div className="h-8 w-full flex justify-between">
			<h1>PushAt</h1>
			{did && (
				<div>
					<button type="button">
						<img src={avatar.result} />
					</button>
				</div>
			)}
		</div>
	);
}

function handleLogin(client: BrowserOAuthClient, setLoading?: (v: boolean) => void) {
	return async () => {
		const handle = await showTextInput({
			title: "ログイン",
			placeholder: "example.bsky.social",
			submitText: "ログイン",
			cancelText: "キャンセル",
			prefix: <IoAt />,
		});
		if (handle == null) return;
		setLoading?.(true);
		try {
			const p = client.signIn(handle, { ui_locales: "ja" });
			toast.promise(
				p,
				{ loading: "ログイン中...", error: (e) => `ログインに失敗しました: ${String(e)}` },
				{ style: { minWidth: "200px" } },
			);
			await p;
		} catch (error) {
			console.error(error);
			setLoading?.(false);
		}
	};
}
