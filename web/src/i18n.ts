import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

// document.langを更新する
const setHtmlLang = (lng: string) => {
	document.documentElement.lang = lng;
};

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init(
		{
			resources: {
				ja: { translation: ja },
				en: { translation: en },
			},
			fallbackLng: "ja",
			interpolation: {
				escapeValue: false,
			},
			detection: {
				order: ["localStorage", "navigator"],
				caches: ["localStorage"],
			},
		},
		() => void setHtmlLang(i18n.resolvedLanguage || i18n.language || "ja"),
	);

i18n.on("languageChanged", setHtmlLang);

export default i18n;
