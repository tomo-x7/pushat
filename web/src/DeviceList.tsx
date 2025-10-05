import { useState } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import toast from "react-hot-toast";
import { FiPlus, FiSmartphone, FiTrash2 } from "react-icons/fi";
import { useAgent } from "./atproto";
import { useToken } from "./fcm";
import type { DeviceListItem as DeviceListItemType } from "./lexicons/types/win/tomo-x/pushat/defs";
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
			deviceList: DeviceListItemType[];
			current: $Typed<RegisteredDevice> | $Typed<UnregisteredDevice> | { $type: string };
	  };
export function useDevices(): Data {
	const agent = useAgent();
	const token = useToken();
	const data = useAsync(async () => {
		try {
			const res = await agent.win.tomoX.pushat.getDevices({ token });
			return { list: res.data.devices, current: res.data.current };
		} catch (error) {
			toast.error("デバイス一覧の取得に失敗しました");
			throw error;
		}
	}, [token, agent]);

	if (data.error != null) throw data.error;
	if (data.loading || data.result == null) return { loading: true };
	return {
		loading: false,
		deviceList: data.result.list,
		current: data.result.current,
	};
}

export interface DeviceListProps {
	list: DeviceListItemType[];
}
export interface CurrentDeviceProps {
	current: $Typed<RegisteredDevice> | $Typed<UnregisteredDevice> | { $type: string };
}
export function DeviceList({ list }: DeviceListProps) {
	return (
		<div className="bg-white rounded-lg shadow-md p-6 max-h-[70vh] flex flex-col">
			<h2 className="text-lg font-semibold text-neutral-900 mb-4 flex-shrink-0">登録済みデバイス一覧</h2>
			<div className="space-y-2 overflow-y-auto flex-1">
				{list.filter((d) => !d.current).length === 0 && (
					<p className="text-neutral-500 text-sm text-center py-4">登録されているデバイスはありません</p>
				)}
				{list
					.filter((d) => !d.current)
					.map((d) => (
						<DeviceListItem key={d.id} item={d} />
					))}
			</div>
		</div>
	);
}
function DeviceListItem({ item }: { item: DeviceListItemType }) {
	const agent = useAgent();
	const [deleted, setDeleted] = useState(false);
	const del = useAsyncCallback(async () => {
		const confirm = await showConfirm({
			title: `デバイス「${item.name}」を削除します。よろしいですか？`,
			confirmText: "削除",
			cancelText: "キャンセル",
			confirmColor: "danger",
		});
		if (!confirm) return;
		await agent.win.tomoX.pushat.deleteDevice({ id: item.id });
		setDeleted(true);
	});
	if (deleted) return null;
	return (
		<div className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200">
			<div className="flex items-center gap-3">
				<FiSmartphone size={18} className="text-neutral-600" />
				<span className="text-neutral-900 font-medium">{item.name}</span>
			</div>
			<button
				disabled={del.loading}
				type="button"
				onClick={() => del.execute()}
				className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors disabled:opacity-50"
				aria-label={`${item.name}を削除`}
			>
				<FiTrash2 size={16} />
			</button>
		</div>
	);
}
export function CurrentDevice({ current }: CurrentDeviceProps) {
	const token = useToken();
	const agent = useAgent();
	const [cur, setCur] = useState<RegisteredDevice | null>(isRegisteredDevice(current) ? current : null);
	const register = useAsyncCallback(async () => {
		const name = await showTextInput({
			title: "デバイスを登録します",
			placeholder: "デバイス名を入力",
			submitText: "登録",
			cancelText: "キャンセル",
		});
		if (name == null) return;
		const res = await agent.win.tomoX.pushat.addDevice({ name, token }).catch((e) => {
			toast.error("デバイスの登録に失敗しました");
			console.error(e);
		});
		if (res != null) setCur({ id: res.data.id, name });
	});
	const del = useAsyncCallback(async () => {
		if (cur == null) return;
		const confirm = await showConfirm({
			title: `デバイス「${cur.name}」を削除します。よろしいですか？`,
			confirmText: "削除",
			cancelText: "キャンセル",
			confirmColor: "danger",
		});
		if (!confirm) return;
		await agent.win.tomoX.pushat.deleteDevice({ id: cur.id }).catch((e) => {
			toast.error("デバイスの削除に失敗しました");
			console.error(e);
		});
		setCur(null);
	});
	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
				<FiSmartphone size={20} className="text-primary-600" />
				現在のデバイス
			</h2>
			{cur != null ? (
				<RegisteredCurrent name={cur.name} disable={del.loading} del={del.execute} />
			) : (
				<UnRegisteredCurrent register={register.execute} disable={register.loading} />
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
		<div className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-neutral-300 rounded-lg bg-neutral-50">
			<div className="p-3 bg-neutral-200 rounded-full mb-3">
				<FiSmartphone size={32} className="text-neutral-500" />
			</div>
			<p className="text-sm text-neutral-700 text-center mb-4">このデバイスはまだ登録されていません</p>
			<button
				disabled={disable}
				type="button"
				onClick={register}
				className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
			>
				<FiPlus size={18} />
				デバイスを登録
			</button>
		</div>
	);
}
