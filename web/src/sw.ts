/// <reference lib="webworker" />
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { FIREBASE_CONFIG } from "./const";

const wsSelf = self as unknown as ServiceWorkerGlobalScope;

const app = initializeApp(FIREBASE_CONFIG);
const messaging = getMessaging(app);
onBackgroundMessage(messaging, (payload) => {
	console.log(payload);
});
