import { useAgentSession, useClient } from "./Provider";

export function App() {
	const client = useClient();
	const agentSession = useAgentSession();
	const login = () => {
		const handle = window.prompt("enter your handle");
		if (!handle) return;
		client.authorize(handle);
	};
	return (
		<>
			<h1>Pushat</h1>
			<div>state:{agentSession?.session.did ?? "logged out"}</div>
			<button type="button" onClick={login}>
				login
			</button>
		</>
	);
}
