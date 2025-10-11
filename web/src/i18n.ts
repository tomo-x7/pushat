import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ja from "./locales/ja.json";
import en from "./locales/en.json";

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
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
	});

// Make i18n globally available for use in non-React contexts
(window as any).i18n = i18n;

export default i18n;
