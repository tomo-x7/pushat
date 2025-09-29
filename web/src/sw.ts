/// <reference lib="webworker" />
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { FIREBASE_CONFIG } from "./const";

const swSelf = self as unknown as ServiceWorkerGlobalScope;

const app = initializeApp(FIREBASE_CONFIG);
const messaging = getMessaging(app);
onBackgroundMessage(messaging, (payload) => {
	console.log("notify");
	console.log(payload);
});

// swSelf.addEventListener("notificationclick", (ev) => {
// 	const data = ev.notification.data as { link: string | undefined } | undefined;
// 	ev.notification.close();
// 	ev.waitUntil(
// 		(async () => {
// 			if (ev.action === "test1") {
// 				return;
// 			}

// 			await swSelf.clients.openWindow(data?.link ?? "https://pushat.tomo-x.win/");
// 		})(),
// 	);
// });

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
