import { useTranslation } from "react-i18next";
import { FiLoader } from "react-icons/fi";

export function Loading() {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col items-center justify-center py-8">
			<FiLoader size={32} className="text-primary-600 animate-[spin_1s_linear_infinite]" />
			<div className="mt-3 text-sm text-neutral-600">{t("common.loading")}</div>
		</div>
	);
}
