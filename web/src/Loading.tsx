import { FiLoader } from "react-icons/fi";

export function Loading() {
	return (
		<div className="flex flex-col items-center justify-center py-8">
			<FiLoader size={32} className="text-primary-600 animate-[spin_1s_linear_infinite]" />
			<div className="mt-3 text-sm text-neutral-600">読み込み中...</div>
		</div>
	);
}
