import { BrowserOAuthClient, type OAuthSession } from "@atproto/oauth-client-browser";
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Loading } from "./Loading";
import { TextInputModal } from "./Modal";
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
	const [showHandleModal, setShowHandleModal] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	const login = async (handle: string) => {
		setIsLoggingIn(true);
		try {
			await client.signIn(handle, {
				ui_locales: "ja",
			});
			setShowHandleModal(false);
		} catch (error) {
			alert("ログインに失敗しました: " + String(error));
			console.error(error);
		} finally {
			setIsLoggingIn(false);
		}
	};

	return (
		<div className="full-center">
			<div className="card">
				<div className="card-body text-center">
					<h1 className="text-2xl font-semibold mb-2">Pushat</h1>
					<p className="text-gray-600 text-sm mb-6">
						BlueSkyアカウントでログインしてプッシュ通知を設定します
					</p>
					<button
						type="button"
						onClick={() => setShowHandleModal(true)}
						className="btn btn-primary"
						disabled={isLoggingIn}
					>
						ログイン
					</button>
				</div>
			</div>

			<TextInputModal
				isOpen={showHandleModal}
				onClose={() => setShowHandleModal(false)}
				onSubmit={login}
				title="ログイン"
				placeholder="ハンドル名を入力 (例: alice.bsky.social)"
				submitText="ログイン"
				isLoading={isLoggingIn}
			/>
		</div>
	);
}
