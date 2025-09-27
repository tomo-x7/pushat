import { BrowserOAuthClient, type OAuthSession } from "@atproto/oauth-client-browser";
import { type ReactNode, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { initFcm } from "./fcm";
import { AtpBaseClient } from "./lexicons";

type ChildATPProps = {
	agentSession: {
		agent: AtpBaseClient;
		session: OAuthSession;
	} | null;
	client: BrowserOAuthClient;
};
export function InitLoad({ children }: { children: (props: ChildATPProps) => ReactNode }) {
	const [atpProps, setAtpProps] = useState<ChildATPProps | null>(null);
	const [initFcmDone, setInitFcmDone] = useState(false);
	const { showBoundary } = useErrorBoundary();
	useEffect(() => {
		BrowserOAuthClient.load({
			clientId: "https://pushat.tomo-x.win/client-metadata.json",
			handleResolver: "https://public.api.bsky.app/",
		})
			.then((client) =>
				client.init().then((res) => {
					if (res?.session == null) return { client, agentSession: null };
					const agent = new AtpBaseClient(res.session.fetchHandler);
					return { client, agentSession: { agent, session: res.session } };
				}),
			)
			.then(setAtpProps)
			.catch(showBoundary);
		return () => {
			setAtpProps(null);
		};
	}, [showBoundary]);
	useEffect(() => {
		initFcm()
			.then(() => setInitFcmDone(true))
			.catch(showBoundary);
		return () => setInitFcmDone(false);
	}, [showBoundary]);
	if (atpProps == null || initFcmDone === false) return <Loading />;
	return children(atpProps);
}

function Loading() {
	return <div>Loading...</div>;
}
