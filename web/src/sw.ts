/// <reference lib="webworker" />
import { FIREBASE_CONFIG } from "./const";

const swSelf = self as unknown as ServiceWorkerGlobalScope;

import("firebase/app")
	.then(({ initializeApp }) => initializeApp(FIREBASE_CONFIG))
	.then(() => import("firebase/messaging/sw"))
	.then(({ getMessaging, onBackgroundMessage }) => {
		const messaging = getMessaging();
		onBackgroundMessage(messaging, (payload) => {
			console.log("notify");
			console.log(payload);
		});
	});

swSelf.addEventListener("notificationclick", (ev) => {
	const data = ev.notification.data.FCM_MSG.notification.data as { link: string | undefined } | undefined;
	ev.preventDefault();
	ev.stopPropagation();
	ev.notification.close();
	ev.waitUntil(
		(async () => {
			await swSelf.clients.openWindow(data?.link ?? `https://pushat.tomo-x.win/default?data=${JSON.stringify(data)}`);
		})(),
	);
});

// activate で clients.claim() して即時制御を取れるようにする
swSelf.addEventListener("activate", (event) => {
	console.log("activate");
	event.waitUntil(
		(async () => {
			try {
				await (self as any).clients.claim();
			} catch (e) {
				// noop
			}
		})(),
	);
});

// クライアントからの命令で即時アクティベートするためのハンドラ
swSelf.addEventListener("message", (event) => {
	const data = event.data;
	if (!data) return;
	if (data.type === "SKIP_WAITING") {
		try {
			(self as any).skipWaiting();
		} catch (e) {
			// noop
		}
	}
});
