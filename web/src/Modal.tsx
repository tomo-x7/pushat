/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
import type { ReactNode } from "react";
import { type PropsWithChildren, useState } from "react";
import { createCallable } from "react-call";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";

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
interface TextProps {
	title: string;
	text: ReactNode;
}
const colors = {
	primary: "var(--color-primary-600)",
	success: "var(--color-success-600)",
	danger: "var(--color-danger-600)",
	warning: "var(--color-warning-600)",
	neutral: "var(--color-neutral-600)",
};

function Modal({ children, close }: PropsWithChildren<{ close: () => void }>) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
				<button
					type="button"
					onClick={close}
					className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-700"
					aria-label="Close"
				>
					<MdClose size={20} />
				</button>
				<div className="p-6">{children}</div>
			</div>
		</div>
	);
}
// 白背景などの余分なものがないモーダル
// childrenで渡す内容には閉じるボタンを置くことを考慮したスタイルにする
function SimpleModal({ children, close }: PropsWithChildren<{ close: () => void }>) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div className="relative w-full max-w-2xl">
				<button
					type="button"
					onClick={close}
					className="absolute -top-2 -right-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-neutral-100 transition-colors text-neutral-700 hover:text-neutral-900 shadow-lg"
					aria-label="Close"
				>
					<MdClose size={24} />
				</button>
				{children}
			</div>
		</div>
	);
}
const TextInput = createCallable<TextInputProps, string | null>(
	({ title, call, placeholder, cancelText, submitText, prefix }) => {
		const { t } = useTranslation();
		const [value, setValue] = useState("");
		const actualCancelText = cancelText ?? t("modal.cancel");
		const actualSubmitText = submitText ?? t("modal.enter");
		return (
			<Modal close={() => call.end(null)}>
				<h2 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h2>
				<div className="mb-6">
					<div className="relative">
						{prefix && (
							<div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-neutral-500 pointer-events-none">
								{prefix}
							</div>
						)}
						<input
							type="text"
							value={value}
							onChange={(e) => setValue(e.target.value)}
							placeholder={placeholder}
							className={`w-full py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
								prefix ? "pl-10 pr-4" : "px-4"
							}`}
						/>
					</div>
				</div>
				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={() => call.end(null)}
						className="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
					>
						{actualCancelText}
					</button>
					<button
						type="button"
						onClick={() => call.end(value)}
						disabled={!value}
						className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors font-medium"
					>
						{actualSubmitText}
					</button>
				</div>
			</Modal>
		);
	},
);
const Confirm = createCallable<ConfirmProps, boolean>(
	({ call, title, message, cancelText = "cancel", confirmText = "ok", confirmColor = "primary" }) => {
		const colorClass = {
			primary: "bg-primary-600 hover:bg-primary-700",
			success: "bg-success-600 hover:bg-success-700",
			danger: "bg-danger-600 hover:bg-danger-700",
			warning: "bg-warning-600 hover:bg-warning-700",
			neutral: "bg-neutral-600 hover:bg-neutral-700",
		}[confirmColor];

		return (
			<Modal close={() => call.end(false)}>
				<h2 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h2>
				{message && <p className="text-neutral-600 mb-6">{message}</p>}
				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={() => call.end(false)}
						className="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
					>
						{cancelText}
					</button>
					<button
						type="button"
						onClick={() => call.end(true)}
						className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${colorClass}`}
					>
						{confirmText}
					</button>
				</div>
			</Modal>
		);
	},
);
const Text = createCallable<TextProps, void>(({ call, text, title }) => (
	<Modal close={() => call.end()}>
		<h2 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h2>
		<p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{text}</p>
	</Modal>
));
const simpleModal = createCallable<{ el: ReactNode }>(({ call, el }) => (
	<SimpleModal close={() => call.end()}>{el}</SimpleModal>
));

// 統一ルートコンポーネント
export function CallRoot() {
	return (
		<>
			<TextInput.Root />
			<Confirm.Root />
			<Text.Root />
		</>
	);
}
/**コンテキスト APIを使うものむけ */
export function CallInnerRoot() {
	return <simpleModal.Root />;
}

// エクスポート関数
export const showTextInput = TextInput.call;
export const showConfirm = Confirm.call;
export const showText = Text.call;
export const showSimpleModal = simpleModal.call;
