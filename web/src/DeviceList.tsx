import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiSmartphone, FiTrash2 } from "react-icons/fi";
import { useAgent } from "./atproto";
import { useToken } from "./fcm";
import { Loading } from "./Loading";
import type { WinTomoXPushatDefs, WinTomoXPushatGetDevices } from "./lexicons";
import { isRegisteredDevice } from "./lexicons/types/win/tomo-x/pushat/getDevices";
import { showConfirm, showTextInput } from "./Modal";
import { useAsync } from "react-async-hook";

export function DeviceList() {
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
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleRegisterDevice = async () => {
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

	if (data.loading) return <Loading />;
	if (data.error) throw data.error;
	if (data.result == null) throw new Error("never happen");
	const { current, list } = data.result;
	return (
		<div>
			<div>
				<h2>現在のデバイス</h2>
				{isRegisteredDevice(current) ? (
					<RegisteredCurrent
						name={current.name}
						disable={isLoading}
						del={deleteDevice(current.id, current.name)}
					/>
				) : (
					<UnRegisteredCurrent register={handleRegisterDevice} disable={isLoading} />
				)}
			</div>
			<div>
				<h2>登録済みデバイス一覧</h2>
				<div>
					{list
						.filter((d) => !d.current)
						.map((d) => (
							<div key={d.id}>
								<div>
									<FiSmartphone size={16} />
									<span>{d.name}</span>
								</div>
								<button disabled={isLoading} type="button" onClick={deleteDevice(d.id, d.name)}>
									<FiTrash2 size={12} />
								</button>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

function RegisteredCurrent({ name, disable, del }: { name: string; disable: boolean; del: () => void }) {
	return (
		<div>
			<div>
				<FiSmartphone size={16} />
				<span>{name}</span>
			</div>
			<div>
				<span>現在</span>
				<button disabled={disable} type="button" onClick={del}>
					<FiTrash2 size={12} />
				</button>
			</div>
		</div>
	);
}
function UnRegisteredCurrent({ register, disable }: { register: () => void; disable: boolean }) {
	return (
		<div>
			<div>
				<FiSmartphone size={48} />
				<div>このデバイスはまだ登録されていません</div>
				<button disabled={disable} type="button" onClick={register}>
					<FiPlus size={16} />
					デバイスを登録
				</button>
			</div>
		</div>
	);
}
