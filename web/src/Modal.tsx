/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
import { useEffect, useState } from "react";
import { createCallable } from "react-call";
import { FiX } from "react-icons/fi";

// テキスト入力モーダル
interface TextInputProps {
	title: string;
	placeholder: string;
	submitText?: string;
	cancelText?: string;
}

function TextInputModal({
	title,
	placeholder,
	submitText = "OK",
	cancelText = "キャンセル",
	call,
}: TextInputProps & { call: any }) {
	const [value, setValue] = useState("");

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (value.trim()) {
			call.end(value.trim());
		}
	};

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
				<form onSubmit={handleSubmit}>
					<div className="modal-body">
						<input
							type="text"
							className="input"
							placeholder={placeholder}
							value={value}
							onChange={(e) => setValue(e.target.value)}
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
			</div>
		</div>
	);
}

// Callableインスタンス作成
const textInput = createCallable<TextInputProps, string | undefined>(TextInputModal);

// 統一ルートコンポーネント
export function CallRoot() {
	return <textInput.Root />;
}

// エクスポート関数
export const showTextInput = textInput.call;
