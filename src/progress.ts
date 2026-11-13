import { CONFIG } from './config.ts';
import type { Spot } from './items.ts';
import { hasCard } from './friend.ts';
import { hasVisited, type SaveData } from './store.ts';

export interface Line { id: string; name: string; stations: string[] }

/**
 * 電車の路線と、そこにあるアプリの駅(駅名はスポットの名前と同じ)。OSMの路線は快速・直通が混ざるので、手で書く。
 * 乗り換え駅は、通る路線のどれにも入る
 */
export const LINES: Line[] = [
  { id: 'chuo', name: 'JR中央線', stations: ['日野', '豊田', '八王子', '西八王子', '高尾'] },
  { id: 'yokohama', name: 'JR横浜線', stations: ['成瀬', '町田', '相原', '八王子みなみ野', '片倉', '八王子'] },
  { id: 'hachiko', name: 'JR八高線', stations: ['八王子', '北八王子', '小宮'] },
  { id: 'keio', name: '京王線', stations: ['聖蹟桜ヶ丘', '百草園', '高幡不動', '南平', '平山城址公園', '長沼', '北野', '京王八王子'] },
  { id: 'keio-takao', name: '京王高尾線', stations: ['高尾山口', '高尾', '狭間', 'めじろ台', '山田', '京王片倉', '北野'] },
  { id: 'keio-sagamihara', name: '京王相模原線', stations: ['多摩境', '南大沢', '京王堀之内', '多摩センター', '永山'] },
  { id: 'keio-dobutsuen', name: '京王動物園線', stations: ['高幡不動', '多摩動物公園'] },
  { id: 'odakyu', name: '小田急小田原線', stations: ['鶴川', '玉川学園前', '町田'] },
  { id: 'odakyu-tama', name: '小田急多摩線', stations: ['唐木田', '多摩センター', '永山'] },
  { id: 'denentoshi', name: '東急田園都市線', stations: ['南町田グランベリーパーク', 'すずかけ台', 'つくし野'] },
  { id: 'monorail', name: '多摩都市モノレール', stations: ['甲州街道', '万願寺', '高幡不動', '程久保', '多摩動物公園', '中央大学・明星大学', '大塚・帝京大学', '松が谷', '多摩センター'] },
  { id: 'cable', name: '高尾登山ケーブル', stations: ['高尾山', '清滝'] },
  { id: 'lift', name: '高尾山のリフト', stations: ['高尾山', '清滝'] },
];

export const CITIES = ['八王子市', '日野市', '町田市', '多摩市'];
export const cityOf = (s: Spot) => s.city ?? '八王子市';

/** 駅ごとの状態。行った / 友達の駅で手に入れた(行ってはいない) / まだ */
export interface Member { id: string; name: string; state: 'visited' | 'friend' | 'none' }

export interface Progress {
  /** 受け取った印のキー(line:… / city:…) */
  key: string;
  kind: 'line' | 'city';
  name: string;
  done: number;
  total: number;
  /** 100%でもらえるかけら */
  reward: number;
  claimed: boolean;
  members: Member[];
}

/** 路線と市ごとの「行った駅 / 全部の駅」。駅名がスポットに無いものは数えない */
export function progressOf(data: SaveData, stations: Spot[]): Progress[] {
  const byName = new Map<string, Spot[]>();
  for (const s of stations) byName.set(s.name, [...(byName.get(s.name) ?? []), s]);
  const make = (kind: Progress['kind'], id: string, name: string, list: Spot[]): Progress => ({
    key: `${kind}:${id}`, kind, name,
    done: list.filter((s) => hasVisited(data, s.id)).length, total: list.length,
    reward: list.length * CONFIG.completeShardsPerStation, claimed: data.rewards[`${kind}:${id}`] != null,
    members: list.map((s) => ({ id: s.id, name: s.name, state: hasVisited(data, s.id) ? 'visited' : hasCard(data, s.id) ? 'friend' : 'none' })),
  });
  return [
    ...LINES.map((l) => make('line', l.id, l.name, l.stations.flatMap((n) => byName.get(n) ?? []))),
    ...CITIES.map((c) => make('city', c, c, stations.filter((s) => cityOf(s) === c))),
  ];
}

/** 100%になって、まだかけらをもらっていない路線・市 */
export const unclaimed = (list: Progress[]) => list.filter((p) => p.total > 0 && p.done >= p.total && !p.claimed);

export interface Claim { data: SaveData; shards: number; message: string }

/** 100%になった路線・市のかけらを配り、もらった印を付ける。配るものが無ければ null */
export function claimRewards(data: SaveData, stations: Spot[], now: number): Claim | null {
  const list = unclaimed(progressOf(data, stations));
  if (!list.length) return null;
  const shards = list.reduce((n, p) => n + p.reward, 0);
  const rewards = { ...data.rewards };
  for (const p of list) rewards[p.key] = now;
  const lines = list.filter((p) => p.kind === 'line'), cities = list.filter((p) => p.kind === 'city');
  const message = list.length === 1
    ? `${list[0].name}の駅を、全部まわった。かけら +${shards}`
    : `${[lines.length ? `路線${lines.length}つ` : '', cities.length ? `市${cities.length}つ` : ''].filter(Boolean).join('と')}を、全部まわった。かけら +${shards}`;
  return { data: { ...data, shards: data.shards + shards, rewards }, shards, message };
}
