import { useRequestToken, useToken } from "./fcm";
import { useAgent, useAgentSession, useClient } from "./Provider";

export function App() {
	const client = useClient();
	const agentSession = useAgentSession();
	const token = useToken();
	const login = async () => {
		const handle = window.prompt("enter your handle");
		if (!handle) return;
		await client.signIn(handle, {
			ui_locales: "ja",
		});
	};
	return (
		<>
			<h1>Pushat</h1>
			<div>state:{agentSession?.session.did ?? "logged out"}</div>
			<button type="button" onClick={login}>
				login
			</button>
			{agentSession != null && token == null && <RegisterPush />}
		</>
	);
}

function RegisterPush() {
	const agent = useAgent();
	const requestToken = useRequestToken();
	const token = useToken();
	const onClick = async () => {
		if (agent == null) return;
		const token = await requestToken();
		if (token == null) return;
		const res = await agent.win.tomoX.pushat.registerToken({ token });
		res.data.success ? alert("registered") : alert(`failed:${res}`);
	};
	return (
		<button type="button" onClick={onClick}>
			Register
		</button>
	);
}
