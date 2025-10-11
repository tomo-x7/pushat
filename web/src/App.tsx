import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Allowlist, useAllowList } from "./AllowList";
import { CurrentDevice, DeviceList, useDevices } from "./DeviceList";
import { Loading } from "./Loading";
import { showSimpleModal } from "./Modal";

export function App() {
	const data = useDevices();
	const isMobile = useMediaQuery({ maxWidth: 900 });
	const Layout = isMobile ? Mobile : Desktop;
	const allowListData = useAllowList();
	if (data.loading) return <Loading />;
	return (
		<Layout
			currentDevice={<CurrentDevice current={data.current} />}
			deviceList={<DeviceList list={data.deviceList} />}
			allowList={<Allowlist data={allowListData.result ?? null} />}
		/>
	);
}
type Props = {
	deviceList: ReactNode;
	allowList: ReactNode;
	currentDevice: ReactNode;
};
function Mobile({ allowList, currentDevice, deviceList }: Props) {
	const { t } = useTranslation();
	return (
		<div className="space-y-4">
			<div>{currentDevice}</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<button
					type="button"
					onClick={() => showSimpleModal({ el: deviceList })}
					className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200 font-medium shadow-sm"
				>
					{t("button.openDeviceList")}
				</button>
				<button
					type="button"
					onClick={() => showSimpleModal({ el: allowList })}
					className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200 font-medium shadow-sm"
				>
					{t("button.openAllowList")}
				</button>
			</div>
		</div>
	);
}
function Desktop({ allowList, currentDevice, deviceList }: Props) {
	return (
		<div className="grid grid-cols-2 gap-6">
			<div className="space-y-6">
				<div>{currentDevice}</div>
				<div>{deviceList}</div>
			</div>
			<div>{allowList}</div>
		</div>
	);
}
