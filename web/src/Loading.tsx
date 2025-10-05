import { FiLoader } from "react-icons/fi";

export function Loading() {
	return (
		<div>
			<div>
				<FiLoader size={32} />
				<div>読み込み中...</div>
			</div>
		</div>
	);
}
