/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
import { type PropsWithChildren, type ReactNode, useState } from "react";
import { createCallable } from "react-call";

interface TextInputProps {
	title: string;
	placeholder: string;
	submitText?: string;
	cancelText?: string;
	prefix?: ReactNode;
}
interface ConfirmProps {
	title: string;
	message?: string;
	confirmText?: string;
	confirmColor?: keyof typeof colors;
	cancelText?: string;
}
const colors = {
	blue: "#00ff00",
	red: "#ff0000",
};

function Modal({ children, close }: PropsWithChildren<{ close: () => void }>) {
	return (
		<div className="bg-black/55 fixed inset-0">
			<div className="bg-white relative">
				<button type="button" onClick={close} className="absolute top-2 right-2">
					x
				</button>
				<div>{children}</div>
			</div>
		</div>
	);
}

const TextInput = createCallable<TextInputProps, string | null>(
	({ title, call, placeholder, cancelText = "cancel", submitText = "enter", prefix }) => {
		const [value, setValue] = useState("");
		return (
			<Modal close={() => call.end(null)}>
				<div>{title}</div>
				<div>
					{prefix}
					<input
						type="text"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder={placeholder}
					/>
				</div>
				<button type="button" onClick={() => call.end(null)}>
					{cancelText}
				</button>
				<button type="button" onClick={() => call.end(value)} disabled={!value}>
					{submitText}
				</button>
			</Modal>
		);
	},
);
const Confirm = createCallable<ConfirmProps, boolean>(
	({ call, title, message, cancelText = "cancel", confirmText = "ok", confirmColor = "blue" }) => {
		return (
			<Modal close={() => call.end(false)}>
				<div>{title}</div>
				<div>{message}</div>
				<button type="button" onClick={() => call.end(false)}>
					{cancelText}
				</button>
				<button type="button" onClick={() => call.end(true)} style={{ color: confirmColor }}>
					{confirmText}
				</button>
			</Modal>
		);
	},
);

// 統一ルートコンポーネント
export function CallRoot() {
	return (
		<>
			<TextInput.Root />
			<Confirm.Root />
		</>
	);
}

// エクスポート関数
export const showTextInput = TextInput.call;
export const showConfirm = Confirm.call;
