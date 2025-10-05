import { useState } from "react";
import { useAsync } from "react-async-hook";
import toast from "react-hot-toast";
import { FiPlus, FiSmartphone, FiTrash2 } from "react-icons/fi";
import { useAgent } from "./atproto";
import { useToken } from "./fcm";
import type { DeviceListItem } from "./lexicons/types/win/tomo-x/pushat/defs";
import {
	isRegisteredDevice,
	type RegisteredDevice,
	type UnregisteredDevice,
} from "./lexicons/types/win/tomo-x/pushat/getDevices";
import type { $Typed } from "./lexicons/util";
import { showConfirm, showTextInput } from "./Modal";

type Data =
	| { loading: true }
	| {
			loading: false;
			deviceList: DeviceListItem[];
			current: $Typed<RegisteredDevice> | $Typed<UnregisteredDevice> | { $type: string };
	  };
type Action = { regCur: () => void; del: (id: string, name: string) => () => void };
export function useDevices(): { data: Data; action: Action; loading: boolean } {
	const agent = useAgent();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const token = useToken();
	const data = useAsync(async () => {
		setIsLoading(true);
		try {
			const res = await agent.win.tomoX.pushat.getDevices({ token });
			return { list: res.data.devices, current: res.data.current };
		} catch (error) {
			toast.error("デバイス一覧の取得に失敗しました");
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const registerCurrent = async () => {
		setIsLoading(true);
		const name = await showTextInput({
			title: "デバイスを登録します",
			placeholder: "デバイス名を入力",
			submitText: "登録",
			cancelText: "キャンセル",
		});
		if (name == null) return;
		try {
			await toast.promise(
				agent.win.tomoX.pushat.addDevice({ name, token }),
				{
					loading: "登録中...",
					success: `デバイス「${name}」を登録しました`,
					error: (e) => `デバイスの登録に失敗しました: ${String(e)}`,
				},
				{ style: { minWidth: "200px" } },
			);
			await data.execute();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const deleteDevice = (id: string, name: string) => async () => {
		const confirm = await showConfirm({
			title: `デバイス「${name}」を削除します。よろしいですか？`,
			confirmText: "削除",
			cancelText: "キャンセル",
			confirmColor: "danger",
		});
		if (!confirm) return;
		try {
			setIsLoading(true);
			await toast.promise(
				agent.win.tomoX.pushat.deleteDevice({ id }),
				{
					loading: "削除中...",
					success: `デバイス「${name}」を削除しました`,
					error: (e) => `デバイスの削除に失敗しました: ${String(e)}`,
				},
				{ style: { minWidth: "200px" } },
			);
			await data.execute();
		} catch (error) {
			toast.error("デバイスの削除に失敗しました");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	if (data.error != null) throw data.error;
	if (data.loading || data.result == null)
		return {
			data: { loading: true },
			action: { regCur: registerCurrent, del: deleteDevice },
			loading: isLoading,
		};
	return {
		data: { loading: false, deviceList: data.result.list, current: data.result.current },
		action: { regCur: registerCurrent, del: deleteDevice },
		loading: isLoading,
	};
}

export interface DeviceListProps {
	list: DeviceListItem[];
	del: (id: string, name: string) => () => void;
	disable?: boolean;
}
export interface CurrentDeviceProps {
	current: $Typed<RegisteredDevice> | $Typed<UnregisteredDevice> | { $type: string };
	register: () => void;
	disable?: boolean;
	del: () => void;
}
export function DeviceList({ list, del, disable = false }: DeviceListProps) {
	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-lg font-semibold text-neutral-900 mb-4">登録済みデバイス一覧</h2>
			<div className="space-y-2">
				{list.filter((d) => !d.current).length === 0 && (
					<p className="text-neutral-500 text-sm text-center py-4">登録されているデバイスはありません</p>
				)}
				{list
					.filter((d) => !d.current)
					.map((d) => (
						<div
							key={d.id}
							className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200"
						>
							<div className="flex items-center gap-3">
								<FiSmartphone size={18} className="text-neutral-600" />
								<span className="text-neutral-900 font-medium">{d.name}</span>
							</div>
							<button
								disabled={disable}
								type="button"
								onClick={del(d.id, d.name)}
								className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors disabled:opacity-50"
								aria-label={`${d.name}を削除`}
							>
								<FiTrash2 size={16} />
							</button>
						</div>
					))}
			</div>
		</div>
	);
}
export function CurrentDevice({ current, register, del, disable = false }: CurrentDeviceProps) {
	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
				<FiSmartphone size={20} className="text-primary-600" />
				現在のデバイス
			</h2>
			{isRegisteredDevice(current) ? (
				<RegisteredCurrent name={current.name} disable={disable} del={del} />
			) : (
				<UnRegisteredCurrent register={register} disable={disable} />
			)}
		</div>
	);
}
function RegisteredCurrent({ name, disable, del }: { name: string; disable: boolean; del: () => void }) {
	return (
		<div className="flex items-center justify-between p-4 bg-primary-50 border-2 border-primary-200 rounded-lg">
			<div className="flex items-center gap-3">
				<div className="p-2 bg-primary-100 rounded-lg">
					<FiSmartphone size={20} className="text-primary-600" />
				</div>
				<div>
					<span className="text-neutral-900 font-semibold text-lg">{name}</span>
					<p className="text-xs text-neutral-600 mt-1">このデバイス</p>
				</div>
			</div>
			<button
				disabled={disable}
				type="button"
				onClick={del}
				className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors disabled:opacity-50"
				aria-label="このデバイスを削除"
			>
				<FiTrash2 size={18} />
			</button>
		</div>
	);
}
function UnRegisteredCurrent({ register, disable }: { register: () => void; disable: boolean }) {
	return (
		<div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-300 rounded-lg bg-neutral-50">
			<div className="p-4 bg-neutral-200 rounded-full mb-4">
				<FiSmartphone size={48} className="text-neutral-500" />
			</div>
			<p className="text-neutral-700 text-center mb-6">このデバイスはまだ登録されていません</p>
			<button
				disabled={disable}
				type="button"
				onClick={register}
				className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
			>
				<FiPlus size={20} />
				デバイスを登録
			</button>
		</div>
	);
}
