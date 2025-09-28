import { useCallback, useEffect, useMemo, useState } from "react";
import { useAgent, useClient, useSession } from "./atproto";
import { useToken } from "./fcm";
import { Loading } from "./Loading";
import type { WinTomoXPushatDefs, WinTomoXPushatGetDevices } from "./lexicons";
import { isRegisteredDevice } from "./lexicons/types/win/tomo-x/pushat/getDevices";

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
				change account
			</button>
			<Device />
		</>
	);
}

function Device() {
	const agent = useAgent();
	const [deviceList, setDeviceList] = useState<WinTomoXPushatDefs.DeviceList | null>(null);
	const [currentDevice, setCurrentDevice] = useState<WinTomoXPushatGetDevices.OutputSchema["current"] | null>(null);
	const [blocked, setBlocked] = useState<boolean>(false);
	const token = useToken();
	const load = useCallback(async () => {
		setBlocked(true);
		setCurrentDevice(null);
		setDeviceList(null);
		await agent.win.tomoX.pushat
			.getDevices({ token })
			.then((res) => {
				setDeviceList(res.data.devices);
				setCurrentDevice(res.data.current);
			})
			.finally(() => setBlocked(false));
	}, [agent, token]);
	useEffect(() => {
		load().catch(window.alert);
	}, [load]);
	const registerDevice = async () => {
		try {
			const name = window.prompt("enter device name");
			if (!name) return;
			const res = await agent.win.tomoX.pushat.addDevice({ name, token }).catch(window.alert);
			await load().catch(window.alert);
		} finally {
			setBlocked(false);
		}
	};
	const deleteDevice = (id: string) => async () => {
		try {
			await agent.win.tomoX.pushat.deleteDevice({ id }).catch(window.alert);
			await load().catch(window.alert);
		} finally {
			setBlocked(false);
		}
	};

	if (deviceList == null || currentDevice == null) return <Loading />;
	return (
		<div>
			<div>Devices</div>
			<div>
				<div>Current</div>
				{isRegisteredDevice(currentDevice) ? (
					<div>
						{currentDevice.name}{" "}
						<button disabled={blocked} type="button" onClick={deleteDevice(currentDevice.id)}>
							delete
						</button>
					</div>
				) : (
					<div>
						<button disabled={blocked} type="button" onClick={registerDevice}>
							register
						</button>
					</div>
				)}
			</div>
			<div>
				{deviceList.map((d) => (
					<div key={d.id}>
						<div>{d.name}</div>
						<button disabled={blocked} type="button" onClick={deleteDevice(d.id)}>
							delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
