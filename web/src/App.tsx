import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiLogOut, FiPlus, FiSmartphone, FiTrash2 } from "react-icons/fi";
import { useAgent, useClient, useSession } from "./atproto";
import { useToken } from "./fcm";
import { Loading } from "./Loading";
import type { WinTomoXPushatDefs, WinTomoXPushatGetDevices } from "./lexicons";
import { isRegisteredDevice } from "./lexicons/types/win/tomo-x/pushat/getDevices";
import { showTextInput } from "./Modal";

export function App() {
	const client = useClient();
	const session = useSession();
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	const handleLogin = async () => {
		setIsLoggingIn(true);
		const handle = await showTextInput({
			title: "アカウント変更",
			placeholder: "@handle.bsky.social",
			submitText: "ログイン",
			cancelText: "キャンセル",
		});
		if (!handle) return;
		try {
			await client.signIn(handle, {
				ui_locales: "ja",
			});
			toast.success("ログインしました");
		} catch (error) {
			toast.error("ログインに失敗しました");
			console.error(error);
		} finally {
			setIsLoggingIn(false);
		}
	};

	return (
		<div className="container">
			<header className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
				<h1 className="text-xl font-semibold">Pushat</h1>
				<button
					disabled={isLoggingIn}
					type="button"
					onClick={handleLogin}
					className="btn btn-secondary btn-small"
				>
					<FiLogOut size={14} />
					アカウント変更
				</button>
			</header>

			<div className="status mb-4">
				<div className="status-dot" />
				<span>{session.did}</span>
			</div>

			<Device />
		</div>
	);
}

function Device() {
	const agent = useAgent();
	const [deviceList, setDeviceList] = useState<WinTomoXPushatDefs.DeviceList | null>(null);
	const [currentDevice, setCurrentDevice] = useState<WinTomoXPushatGetDevices.OutputSchema["current"] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const token = useToken();

	const load = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await agent.win.tomoX.pushat.getDevices({ token });
			setDeviceList(res.data.devices);
			setCurrentDevice(res.data.current);
		} catch (error) {
			toast.error("デバイス一覧の取得に失敗しました");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [agent, token]);

	useEffect(() => {
		load();
	}, [load]);

	const handleRegisterDevice = async () => {
		setIsLoading(true);
		const name = await showTextInput({
			title: "デバイス名入力",
			placeholder: "デバイス名を入力",
			submitText: "登録",
			cancelText: "キャンセル",
		});
		if (!name) return;
		try {
			await agent.win.tomoX.pushat.addDevice({ name, token });
			toast.success("デバイスを登録しました");
			await load();
		} catch (error) {
			toast.error("デバイスの登録に失敗しました");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const deleteDevice = (id: string, name: string) => async () => {
		try {
			setIsLoading(true);
			await agent.win.tomoX.pushat.deleteDevice({ id });
			toast.success(`デバイス「${name}」を削除しました`);
			await load();
		} catch (error) {
			toast.error("デバイスの削除に失敗しました");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	if (deviceList == null || currentDevice == null) return <Loading />;

	return (
		<div>
			<section className="mb-6">
				<h2 className="text-lg font-semibold mb-3">現在のデバイス</h2>
				{isRegisteredDevice(currentDevice) ? (
					<div className="device-item current">
						<div className="flex items-center gap-2">
							<FiSmartphone size={16} />
							<span className="device-name">{currentDevice.name}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="device-badge">現在</span>
							<button
								disabled={isLoading}
								type="button"
								onClick={deleteDevice(currentDevice.id, currentDevice.name)}
								className="btn btn-danger btn-small"
							>
								<FiTrash2 size={12} />
							</button>
						</div>
					</div>
				) : (
					<div className="card">
						<div className="card-body text-center">
							<FiSmartphone size={48} className="text-gray-400 mb-3 mx-auto" />
							<p className="text-gray-600 text-sm mb-4">このデバイスはまだ登録されていません</p>
							<button
								disabled={isLoading}
								type="button"
								onClick={handleRegisterDevice}
								className="btn btn-primary"
							>
								<FiPlus size={16} />
								デバイスを登録
							</button>
						</div>
					</div>
				)}
			</section>

			{deviceList.length > 0 && (
				<section>
					<h2 className="text-lg font-semibold mb-3">登録済みデバイス一覧</h2>
					<div className="device-list">
						{deviceList.map((d) => (
							<div key={d.id} className="device-item">
								<div className="flex items-center gap-2">
									<FiSmartphone size={16} />
									<span className="device-name">{d.name}</span>
								</div>
								<button
									disabled={isLoading}
									type="button"
									onClick={deleteDevice(d.id, d.name)}
									className="btn btn-danger btn-small"
								>
									<FiTrash2 size={12} />
								</button>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
