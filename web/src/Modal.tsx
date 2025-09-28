import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="modal-overlay"
			onClick={onClose}
			role="button"
			tabIndex={-1}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onClose();
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
						<button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
							<FiX size={20} />
						</button>
					</div>
				</div>
				{children}
			</div>
		</div>
	);
}

interface TextInputModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (value: string) => void;
	title: string;
	placeholder: string;
	submitText?: string;
	cancelText?: string;
	isLoading?: boolean;
}

export function TextInputModal({
	isOpen,
	onClose,
	onSubmit,
	title,
	placeholder,
	submitText = "OK",
	cancelText = "キャンセル",
	isLoading = false,
}: TextInputModalProps) {
	const [value, setValue] = useState("");

	useEffect(() => {
		if (isOpen) {
			setValue("");
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (value.trim() && !isLoading) {
			onSubmit(value.trim());
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
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
					<button type="button" onClick={onClose} className="btn btn-secondary" disabled={isLoading}>
						{cancelText}
					</button>
					<button type="submit" className="btn btn-primary" disabled={!value.trim() || isLoading}>
						{submitText}
					</button>
				</div>
			</form>
		</Modal>
	);
}
