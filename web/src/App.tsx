import type { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { Allowlist } from "./AllowList";
import { CurrentDevice, DeviceList, useDevices } from "./DeviceList";
import { Loading } from "./Loading";
import { isRegisteredDevice as isRegistered } from "./lexicons/types/win/tomo-x/pushat/getDevices";
import { showSimpleModal } from "./Modal";

export function App() {
	const { data, action, loading: deviceLoading } = useDevices();
	const isMobile = useMediaQuery({ maxWidth: 650 });
	const Layout = isMobile ? Mobile : Desktop;
	if (data.loading) return <Loading />;
	return (
		<Layout
			currentDevice={
				<CurrentDevice
					current={data.current}
					register={action.regCur}
					del={isRegistered(data.current) ? action.del(data.current.id, data.current.name) : () => void 0}
					disable={deviceLoading}
				/>
			}
			deviceList={<DeviceList list={data.deviceList} del={action.del} disable={deviceLoading} />}
			allowList={<Allowlist />}
		/>
	);
}
type Props = {
	deviceList: ReactNode;
	allowList: ReactNode;
	currentDevice: ReactNode;
};
function Mobile({ allowList, currentDevice, deviceList }: Props) {
	return (
		<div>
			<div>{currentDevice}</div>
			<button type="button" onClick={() => showSimpleModal({ el: deviceList })}>
				デバイス一覧を開く
			</button>
			<button type="button" onClick={() => showSimpleModal({ el: allowList })}>
				許可済みサービス一覧を開く
			</button>
		</div>
	);
}
function Desktop({ allowList, currentDevice, deviceList }: Props) {
	return (
		<div>
			<div>
				<div>{currentDevice}</div>
				<div>{deviceList}</div>
			</div>
			<div>{allowList}</div>
		</div>
	);
}
