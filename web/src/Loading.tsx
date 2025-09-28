import { FiLoader } from "react-icons/fi";

export function Loading() {
	return (
		<div className="full-center">
			<div className="flex flex-col items-center gap-3">
				<FiLoader className="animate-spin" size={32} />
				<div className="text-gray-600">読み込み中...</div>
			</div>
		</div>
	);
}
