/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
import { useEffect, useState } from "react";
import { createCallable } from "react-call";
import { FiX } from "react-icons/fi";

// 基本モーダルコンポーネント
function Modal({ title, children, call }: { title: string; children: React.ReactNode; call: any }) {
	useEffect(() => {
		document.body.style.overflow = "hidden";

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") call.end();
		};

		document.addEventListener("keydown", handleEscape);
		return () => {
			document.body.style.overflow = "unset";
			document.removeEventListener("keydown", handleEscape);
		};
	}, [call]);

	return (
		<div className="modal-overlay" onClick={() => call.end()}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<div className="flex justify-between items-center">
						<h2 className="modal-title">{title}</h2>
						<button type="button" onClick={() => call.end()} className="text-gray-500 hover:text-gray-700">
							<FiX size={20} />
						</button>
					</div>
				</div>
				{children}
			</div>
		</div>
	);
}

// テキスト入力モーダル
interface TextInputProps {
	title: string;
	placeholder: string;
	submitText?: string;
	cancelText?: string;
}

function TextInput({
	title,
	placeholder,
	submitText = "OK",
	cancelText = "キャンセル",
	call,
}: TextInputProps & { call: any }) {
	const [value, setValue] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (value.trim()) {
			call.end(value.trim());
		}
	};

	return (
		<Modal title={title} call={call}>
			<form onSubmit={handleSubmit}>
				<div className="modal-body">
					<input
						type="text"
						className="input"
						placeholder={placeholder}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						// biome-ignore lint/a11y/noAutofocus: <>
						autoFocus
					/>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-secondary" onClick={() => call.end()}>
						{cancelText}
					</button>
					<button type="submit" className="btn btn-primary" disabled={!value.trim()}>
						{submitText}
					</button>
				</div>
			</form>
		</Modal>
	);
}

// 確認モーダル
interface ConfirmProps {
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
}

function Confirm({
	title,
	message,
	confirmText = "OK",
	cancelText = "キャンセル",
	call,
}: ConfirmProps & { call: any }) {
	return (
		<Modal title={title} call={call}>
			<div className="modal-body">
				<p className="text-gray-700">{message}</p>
			</div>
			<div className="modal-footer">
				<button type="button" className="btn btn-secondary" onClick={() => call.end(false)}>
					{cancelText}
				</button>
				<button type="button" className="btn btn-primary" onClick={() => call.end(true)}>
					{confirmText}
				</button>
			</div>
		</Modal>
	);
}

// Callableインスタンス作成
const textInput = createCallable<TextInputProps, string | undefined>(TextInput);
const confirm = createCallable<ConfirmProps, boolean | undefined>(Confirm);

// 統一ルートコンポーネント
export function CallRoot() {
	return (
		<>
			<textInput.Root />
			<confirm.Root />
		</>
	);
}

// エクスポート関数
export const showTextInput = textInput.call;
export const showConfirm = confirm.call;

// 後方互換性（必要に応じて）
export const showTextInputModal = showTextInput;
export const showConfirmModal = showConfirm;
