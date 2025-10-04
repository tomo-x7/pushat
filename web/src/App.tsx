import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiLogOut, FiPlus, FiSmartphone, FiTrash2 } from "react-icons/fi";
import { useAgent, useClient, useSession } from "./atproto";
import { useToken } from "./fcm";
import { Loading } from "./Loading";
import type { WinTomoXPushatDefs, WinTomoXPushatGetDevices } from "./lexicons";
import { isRegisteredDevice } from "./lexicons/types/win/tomo-x/pushat/getDevices";
import { showTextInput } from "./Modal";
import { DeviceList } from "./DeviceList";

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
	const updateSw = async () => {
		const regist = await navigator.serviceWorker.getRegistration();
		if (regist == null) return;
		regist.update();
		if (regist.waiting) {
			// waiting service worker に skipWaiting を要求
			try {
				regist.waiting.postMessage({ type: "SKIP_WAITING" });
			} catch (e) {
				console.warn("postMessage to waiting failed:", e);
			}

			// controllerchange を待ってリロード（新しい SW が制御を取ったら）
			await new Promise<void>((resolve) => {
				if (navigator.serviceWorker.controller) {
					const onControllerChange = () => {
						navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
						resolve();
					};
					navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
				} else {
					// controller がない場合は即 resolve
					resolve();
				}
			});
			window.location.reload();
		}
	};

	return (
		<div className="container">
			<header className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
				<h1 className="text-xl font-semibold">Pushat</h1>
				<button type="button" onClick={updateSw}>
					update
				</button>
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

			<DeviceList />
		</div>
	);
}


