import React, { useState, useEffect } from "react";
import { createCallable } from "react-call";
import { FiX } from "react-icons/fi";

interface BaseModalProps {
	title: string;
	children: React.ReactNode;
}

function BaseModal({ title, children, call }: BaseModalProps & { call: any }) {
	useEffect(() => {
		document.body.style.overflow = "hidden";

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				call.end();
			}
		};

		document.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = "unset";
			document.removeEventListener("keydown", handleEscape);
		};
	}, [call]);

	const handleOverlayClick = () => {
		call.end();
	};

	return (
		<div
			className="modal-overlay"
			onClick={handleOverlayClick}
			role="button"
			tabIndex={-1}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					call.end();
				}
			}}
		>
			<div
				className="modal"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				tabIndex={-1}
				onKeyDown={() => {}}
			>
				<div className="modal-header">
					<div className="flex justify-between items-center">
						<h2 className="modal-title">{title}</h2>
						<button
							type="button"
							onClick={handleOverlayClick}
							className="text-gray-500 hover:text-gray-700"
						>
							<FiX size={20} />
						</button>
					</div>
				</div>
				{children}
			</div>
		</div>
	);
}

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
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!value.trim() || isLoading) return;

		setIsLoading(true);
		try {
			call.end(value.trim());
		} catch (error) {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		call.end();
	};

	return (
		<BaseModal title={title} call={call}>
			<form onSubmit={handleSubmit}>
				<div className="modal-body">
					<div className="form-group">
						<input
							type="text"
							className="input"
							placeholder={placeholder}
							value={value}
							onChange={(e) => setValue(e.target.value)}
							disabled={isLoading}
						/>
					</div>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-secondary" disabled={isLoading} onClick={handleCancel}>
						{cancelText}
					</button>
					<button type="submit" className="btn btn-primary" disabled={!value.trim() || isLoading}>
						{submitText}
					</button>
				</div>
			</form>
		</BaseModal>
	);
}

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
	const handleConfirm = () => {
		call.end(true);
	};

	const handleCancel = () => {
		call.end(false);
	};

	return (
		<BaseModal title={title} call={call}>
			<div className="modal-body">
				<p className="text-gray-700">{message}</p>
			</div>
			<div className="modal-footer">
				<button type="button" className="btn btn-secondary" onClick={handleCancel}>
					{cancelText}
				</button>
				<button type="button" className="btn btn-primary" onClick={handleConfirm}>
					{confirmText}
				</button>
			</div>
		</BaseModal>
	);
}

// Callableインスタンスを作成
const textInputCallable = createCallable<TextInputProps, string | undefined>(TextInput);
const confirmCallable = createCallable<ConfirmProps, boolean | undefined>(Confirm);

// エクスポートする関数
export const showTextInput = textInputCallable.call;
export const showConfirm = confirmCallable.call;
export const TextInputRoot = textInputCallable.Root;
export const ConfirmRoot = confirmCallable.Root;

// 後方互換性のためのエイリアス
export const showTextInputModal = showTextInput;
export const showConfirmModal = showConfirm;
