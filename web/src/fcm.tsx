import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-hot-toast";
import { FiBell } from "react-icons/fi";
import { FIREBASE_CONFIG, VAPID_KEY } from "./const";
import { MessagingNotSupportedError, ServiceWorkerNotSupportedError } from "./Error";
import { Loading } from "./Loading";

async function assertSupport() {
	if ((await isSupported()) === false) throw new MessagingNotSupportedError();
	if (!("navigator" in window)) throw new ServiceWorkerNotSupportedError();
	if (!("serviceWorker" in navigator)) throw new ServiceWorkerNotSupportedError();
}

let sw: ServiceWorkerRegistration | null = null;
export function FcmBaseProvider({ children }: PropsWithChildren) {
	const alreadyLoaded = useRef(false);
	const [loadFinished, setLoadFinished] = useState(false);
	const { showBoundary } = useErrorBoundary();

	useEffect(() => {
		if (alreadyLoaded.current) return;
		if (sw != null) return;
		alreadyLoaded.current = true;
		assertSupport()
			.then(() => {
				initializeApp(FIREBASE_CONFIG);
				return navigator.serviceWorker.register("/sw.js", { scope: "/" });
			})
			.then((newSw) => {
				sw = newSw;
				setLoadFinished(true);
			})
			.catch(showBoundary);
	}, [showBoundary]);

	if (!loadFinished) return <Loading />;
	return <>{children}</>;
}

let getTokenPromiseCache: Promise<string | null | undefined | void> | undefined;
async function getTokenWithoutRequestPermission() {
	if (sw == null) throw new Error("sw is null");
	const messaging = getMessaging();
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
	if (sw == null) throw new Error("sw is null");
	const messaging = getMessaging();
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
	const token = useContext(TokenContext);
	if (token == null) throw new Error("token is null");
	return token;
}
export function useRequestToken() {
	return useContext(RequestTokenContext);
}

export function FcmTokenProvider({ children }: PropsWithChildren) {
	const [token, setToken] = useState<string | "loading" | "notGranted">("loading");
	useEffect(() => {
		getTokenWithoutRequestPermission()
			.then((token) => {
				if (token) setToken(token);
				else setToken("notGranted");
			})
			.catch(() => {});
	}, []);
	const requestToken = useCallback<() => Promise<RequestTokenResult>>(async () => {
		if (token) return { ok: true };
		const result = await getTokenWithRequestPermission();
		if (result != null && "token" in result && result.token != null) {
			setToken(result.token);
			return { ok: true };
		}
		console.warn(result.error);
		return { ok: false, error: result.error };
	}, [token]);
	if (token === "loading") return <Loading />;
	if (token === "notGranted") return <RequestTokenScreen requestToken={requestToken} />;
	return <TokenContext value={token}>{children}</TokenContext>;
}
type RequestTokenResult = { ok: true } | { ok: false; error: string };
function RequestTokenScreen({ requestToken }: { requestToken: () => Promise<RequestTokenResult> }) {
	const [isRequesting, setIsRequesting] = useState(false);

	const onClick = async () => {
		setIsRequesting(true);
		try {
			const result = await requestToken();
			if (!result.ok) {
				toast.error(`通知の許可に失敗しました: ${result.error}`);
			}
		} finally {
			setIsRequesting(false);
		}
	};

	return (
		<div className="full-center">
			<div className="card">
				<div className="card-body text-center">
					<FiBell size={48} className="text-blue-600 mb-4 mx-auto" />
					<h2 className="text-lg font-semibold mb-2">プッシュ通知を許可</h2>
					<p className="text-gray-600 text-sm mb-6">
						重要な通知を受け取るために、プッシュ通知を許可してください
					</p>
					<button type="button" onClick={onClick} className="btn btn-primary" disabled={isRequesting}>
						<FiBell size={16} />
						通知を許可
					</button>
				</div>
			</div>
		</div>
	);
}
