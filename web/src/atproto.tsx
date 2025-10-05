import { BrowserOAuthClient, type OAuthSession } from "@atproto/oauth-client-browser";
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { useAsync } from "react-async-hook";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-hot-toast";
import { IoAt } from "react-icons/io5";
import { MdInfo } from "react-icons/md";
import { About } from "./About";
import bskyJa from "./assets/bsky-ja.svg";
import { Loading } from "./Loading";
import { AtpBaseClient } from "./lexicons";
import { showText, showTextInput } from "./Modal";

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
				<div className="min-h-screen flex flex-col bg-neutral-50">
					<Header client={client} did={session.did} />
					<main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">{children}</main>
				</div>
			</AgentSessionContext>
		</ClientContext>
	);
}

function LoginScreen({ client }: { client: BrowserOAuthClient }) {
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	return (
		<div className="min-h-screen flex flex-col bg-neutral-50">
			<Header client={client} />
			<div className="flex-1 flex items-center justify-center px-4">
				<div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-neutral-900 mb-2">PushAtへようこそ</h2>
					</div>
					<About hiddenFooter />
					<div className="pt-4">
						<button
							type="button"
							onClick={handleLogin(client, setIsLoggingIn)}
							disabled={isLoggingIn}
							className="w-full flex items-center justify-center py-3 rounded-lg hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-200"
						>
							<img src={bskyJa} alt="login with Bluesky" width={180} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function Header({ did, client }: { did?: string; client: BrowserOAuthClient }) {
	const [isPDOpen, setIsPDOpen] = useState(false);
	const avatar = useAsync<string>(async () => {
		if (!did) return;
		return await fetch(
			`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did)}`,
		)
			.then((res) => res.json())
			.then((res) => res.avatar);
	}, [did]);
	return (
		<header className="w-full bg-white border-b border-neutral-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-primary-600">PushAt</h1>
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => showText({ title: "About PushAt", text: <About /> })}
						className="flex items-center gap-2 px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors"
					>
						<MdInfo size={20} />
						<span className="text-sm font-medium">About</span>
					</button>
					{did && (
						<div className="relative">
							<button
								type="button"
								onClick={(ev) => {
									ev.stopPropagation();
									setIsPDOpen((v) => !v);
								}}
								disabled={avatar.result == null}
								className="w-10 h-10 rounded-full overflow-hidden border-2 border-neutral-200 hover:border-primary-500 transition-colors disabled:opacity-50"
							>
								{avatar.result && (
									<img
										width={40}
										height={40}
										src={avatar.result}
										alt="User avatar"
										className="w-full h-full object-cover"
									/>
								)}
							</button>
							{isPDOpen && (
								<UserPulldown close={() => setIsPDOpen(false)} changeUser={handleLogin(client)} />
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
function UserPulldown({ close, changeUser }: { close: () => void; changeUser: () => void }) {
	useEffect(() => {
		document.addEventListener("click", close);
		return () => document.removeEventListener("click", close);
	}, [close]);
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: a
		<div onClick={(ev) => ev.stopPropagation()} className="absolute right-0 top-12 z-50">
			<div className="bg-white rounded-lg shadow-xl border border-neutral-200 py-2 min-w-48">
				<button
					type="button"
					onClick={changeUser}
					className="w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-50 transition-colors"
				>
					ユーザー切り替え
				</button>
			</div>
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
