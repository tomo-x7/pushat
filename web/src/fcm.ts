import { type FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, type Messaging } from "firebase/messaging";
import { useCallback, useEffect, useState } from "react";
import { FIREBASE_CONFIG, VAPID_KEY } from "./const";

let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;
let sw: ServiceWorkerRegistration | undefined;
let getTokenPromiseCache: Promise<string | null | undefined | void> | undefined;


export async function init() {
	await assertSupport();
	app = initializeApp(FIREBASE_CONFIG);
	messaging = getMessaging(app);
	sw = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
}
async function getTokenWithoutRequestPermission() {
	if (messaging == null) throw new Error("messaging not initialized");
	if (getTokenPromiseCache == null)
		getTokenPromiseCache = getToken(messaging, { vapidKey: VAPID_KEY }).catch(console.error).finally(()=>{getTokenPromiseCache=undefined;});
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
	const result = await Notification.requestPermission().catch(console.error);
	if (result === "granted") {
		const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: sw }).catch(
			console.error,
		);
		if (token) {
			return { token };
		} else {
			return { error: "getToken failed" };
		}
	}
	return { error: "not granted" };
}

export function useToken() {
	const [token, setToken] = useState<string | null>(null);
	useEffect(() => {
		getTokenWithoutRequestPermission().then(setToken);
	}, []);
	const requestToken = useCallback(async () => {
		if (token) return true;
		const result = await getTokenWithRequestPermission();
		if (result != null && "token" in result && result.token != null) {
			setToken(result.token);
			return true;
		}
		return result.error;
	}, [token]);
	return [token, requestToken] as const;
}
export class MessagingNotSupportedError extends Error {}
export class ServiceWorkerNotSupportedError extends Error {}
async function assertSupport(){
	if(await isSupported()===false)throw new MessagingNotSupportedError()
	if(!("navigator" in window))throw new ServiceWorkerNotSupportedError()
	if(!("serviceWorker" in navigator))throw new ServiceWorkerNotSupportedError()
}
