import { type FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, type Messaging } from "firebase/messaging";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { FIREBASE_CONFIG, VAPID_KEY } from "./const";
import { MessagingNotSupportedError, ServiceWorkerNotSupportedError } from "./Error";

let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;
let sw: ServiceWorkerRegistration | undefined;

export async function initFcm() {
	await assertSupport();
	if (app != null && messaging != null && sw != null) return;
	app = initializeApp(FIREBASE_CONFIG);
	messaging = getMessaging(app);
	sw = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

let getTokenPromiseCache: Promise<string | null | undefined | void> | undefined;
async function getTokenWithoutRequestPermission() {
	if (messaging == null) throw new Error("messaging not initialized");
	if (getTokenPromiseCache == null)
		getTokenPromiseCache = getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: sw }).finally(
			() => {
				getTokenPromiseCache = undefined;
			},
		);
	const token = await getTokenPromiseCache;
	if (token) {
		return token;
	}
	return null;
}
// クリックイベントでしか呼ばれないのでキャッシュ不要
export async function getTokenWithRequestPermission() {
	if (messaging == null) throw new Error("messaging not initialized");
	if (sw == null) throw new Error("sw not initialized");
	const result = await Notification.requestPermission();
	if (result === "granted") {
		const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: sw });
		if (token) {
			return { token };
		} else {
			return { error: "getToken failed" };
		}
	}
	return { error: "not granted" };
}

const TokenContext = createContext<string | null>(null);
const RequestTokenContext = createContext<() => Promise<string | null>>(async () => null);

export function useToken() {
	return useContext(TokenContext);
}
export function useRequestToken() {
	return useContext(RequestTokenContext);
}

export function TokenProvider({ children }: PropsWithChildren) {
	const [token, setToken] = useState<string | null>(null);
	useEffect(() => {
		// 未認可の場合エラーになるが問題ないので握りつぶす
		getTokenWithoutRequestPermission().then(setToken).catch();
	}, []);
	const requestToken = useCallback(async () => {
		if (token) return token;
		const result = await getTokenWithRequestPermission();
		if (result != null && "token" in result && result.token != null) {
			setToken(result.token);
			return result.token;
		}
		console.warn(result.error);
		return null;
	}, [token]);
	return (
		<RequestTokenContext value={requestToken}>
			<TokenContext value={token}>{children}</TokenContext>
		</RequestTokenContext>
	);
}

async function assertSupport() {
	if ((await isSupported()) === false) throw new MessagingNotSupportedError();
	if (!("navigator" in window)) throw new ServiceWorkerNotSupportedError();
	if (!("serviceWorker" in navigator)) throw new ServiceWorkerNotSupportedError();
}
