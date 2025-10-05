import { AtUri } from "@atproto/syntax";
import { useMemo, useState } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { FiTrash2 } from "react-icons/fi";
import { useAgent, useSession } from "./atproto";
import { Loading } from "./Loading";
import type { AtpBaseClient, WinTomoXPushatAllow } from "./lexicons";

type Data = { uri: string; record: WinTomoXPushatAllow.Record };
export function Allowlist({ data }: { data: Data[] | null }) {
	if (data == null) return <Loading />;
	return (
		<div className="bg-white rounded-lg shadow-md p-6 max-h-[70vh] flex flex-col">
			<h2 className="text-lg font-semibold text-neutral-900 mb-4 flex-shrink-0">許可済みサービス一覧</h2>
			<div className="space-y-2 overflow-y-auto flex-1">
				{data.length === 0 ? (
					<p className="text-neutral-500 text-sm text-center py-4">許可済みサービスはありません</p>
				) : (
					data.map((item) => <AllowListItem key={item.uri} item={item} />)
				)}
			</div>
		</div>
	);
}
function AllowListItem({ item }: { item: Data }) {
	const [deleted, setDeleted] = useState(false);
	const { rkey: serviceDid } = useMemo(() => new AtUri(item.uri), [item.uri]);
	const agent = useAgent();
	const session = useSession();
	const del = useAsyncCallback(async () => {
		await agent.win.tomoX.pushat.allow.delete({ repo: session.did, rkey: serviceDid });
		setDeleted(true);
	});
	if (deleted) return null;
	return (
		<div className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200">
			<div className="flex-1 truncate">
				<span className="text-neutral-900 font-medium text-sm">{serviceDid}</span>
			</div>
			<button
				type="button"
				onClick={del.execute}
				disabled={del.loading}
				className="ml-3 p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
				aria-label={`${serviceDid}を削除`}
			>
				<FiTrash2 size={16} />
			</button>
		</div>
	);
}

export function useAllowList() {
	const agent = useAgent();
	const session = useSession();
	const data = useAsync(() => fetchAllowlist(agent, session.did), [agent, session.did]);
	return data;
}
async function fetchAllowlist(agent: AtpBaseClient, did: string) {
	const data: Data[] = [];
	let cursor: string | undefined;
	do {
		const res = await agent.win.tomoX.pushat.allow.list({ repo: did, cursor, limit: 100 });
		data.push(...res.records.map((r) => ({ uri: r.uri, record: r.value })));
		cursor = res.cursor;
	} while (cursor);
	return data;
}
