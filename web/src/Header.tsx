import type { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import { About } from "./About";
import { handleLogin } from "./atproto";
import { showText } from "./Modal";

export function Header({ did, client }: { did?: string; client: BrowserOAuthClient }) {
	const { t, i18n } = useTranslation();
	const [isPDOpen, setIsPDOpen] = useState(false);
	const [isLangOpen, setIsLangOpen] = useState(false);
	const avatar = useAsync<string>(async () => {
		if (!did) return;
		return await fetch(
			`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did)}`,
		)
			.then((res) => res.json())
			.then((res) => res.avatar);
	}, [did]);
	return (
		<header className="w-full bg-white border-b border-neutral-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
				<h1 className="text-2xl font-bold text-primary-600">{t("header.title")}</h1>
				<div className="flex items-center gap-2 flex-1">
					<button
						type="button"
						onClick={() => showText({ title: t("about.title"), text: <About /> })}
						className="flex items-center gap-2 px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors"
					>
						<span className="text-sm font-medium">{t("header.about")}</span>
					</button>
					<div className="relative">
						<button
							type="button"
							onClick={(ev) => {
								ev.stopPropagation();
								setIsLangOpen((v) => !v);
							}}
							className="flex items-center gap-2 px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors"
						>
							<MdLanguage size={18} />
							<span className="text-sm font-medium">{i18n.language === "ja" ? "日本語" : "English"}</span>
						</button>
						{isLangOpen && (
							<LanguageSwitcher close={() => setIsLangOpen(false)} currentLang={i18n.language} />
						)}
					</div>
				</div>
				{did && (
					<div className="relative flex-shrink-0">
						<button
							type="button"
							onClick={(ev) => {
								ev.stopPropagation();
								setIsPDOpen((v) => !v);
							}}
							disabled={avatar.result == null}
							className="w-10 h-10 rounded-full overflow-hidden border-2 border-neutral-200 hover:border-primary-500 transition-colors disabled:opacity-50"
						>
							{avatar.result && (
								<img
									width={40}
									height={40}
									src={avatar.result}
									alt="User avatar"
									className="w-full h-full object-cover"
								/>
							)}
						</button>
						{isPDOpen && (
							<UserPulldown
								close={() => setIsPDOpen(false)}
								changeUser={handleLogin(client, t, i18n.language)}
							/>
						)}
					</div>
				)}
			</div>
		</header>
	);
}
function UserPulldown({ close, changeUser }: { close: () => void; changeUser: () => void }) {
	const { t } = useTranslation();
	useEffect(() => {
		document.addEventListener("click", close);
		return () => document.removeEventListener("click", close);
	}, [close]);
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: a
		<div onClick={(ev) => ev.stopPropagation()} className="absolute right-0 top-12 z-50">
			<div className="bg-white rounded-lg shadow-xl border border-neutral-200 py-2 min-w-48">
				<button
					type="button"
					onClick={changeUser}
					className="w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-100 transition-colors"
				>
					{t("header.switchUser")}
				</button>
			</div>
		</div>
	);
}

function LanguageSwitcher({ close, currentLang }: { close: () => void; currentLang: string }) {
	const { i18n } = useTranslation();
	useEffect(() => {
		document.addEventListener("click", close);
		return () => document.removeEventListener("click", close);
	}, [close]);

	const changeLang = (lang: string) => {
		i18n.changeLanguage(lang);
		close();
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: a
		<div onClick={(ev) => ev.stopPropagation()} className="absolute right-0 top-12 z-50">
			<div className="bg-white rounded-lg shadow-xl border border-neutral-200 py-2 min-w-32">
				<button
					type="button"
					onClick={() => changeLang("ja")}
					className={`w-full px-4 py-2 text-left hover:bg-neutral-100 transition-colors ${
						currentLang === "ja" ? "text-primary-600 font-medium" : "text-neutral-700"
					}`}
				>
					日本語
				</button>
				<button
					type="button"
					onClick={() => changeLang("en")}
					className={`w-full px-4 py-2 text-left hover:bg-neutral-100 transition-colors ${
						currentLang === "en" ? "text-primary-600 font-medium" : "text-neutral-700"
					}`}
				>
					English
				</button>
			</div>
		</div>
	);
}
