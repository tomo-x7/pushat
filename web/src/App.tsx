import { useRequestToken, useToken } from "./fcm";
import { useAgent, useClient, useSession } from "./atproto";
import { useEffect, useState } from "react";
import type { WinTomoXPushatDefs } from "./lexicons";
import { Loading } from "./Loading";

export function App() {
	const client = useClient();
	const session = useSession();
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
			<div>state:{session.did}</div>
			<div>token:{token}</div>
			<button type="button" onClick={login}>
				login
			</button>
		</>
	);
}

function Device() {
	const agent = useAgent();
	const [deviceList, setDeviceList] = useState<WinTomoXPushatDefs.DeviceList | null>(null);
	useEffect(() => {
		agent.win.tomoX.pushat.listDevices().then((res) => {
			setDeviceList(res.data.devices);
		});
	}, [agent]);
	const deleteDevice = (id: string) => async () => {
		await agent.win.tomoX.pushat.deleteDevice({ id }).catch(window.alert);
	};

	if (deviceList == null) return <Loading />;
	return (
		<div>
			{deviceList.map((d) => (
				<div key={d.id}>
					<div>{d.name}</div>
					<button type="button" onClick={deleteDevice(d.id)}>
						delete
					</button>
				</div>
			))}
		</div>
	);
}
