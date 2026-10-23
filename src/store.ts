import { CONFIG } from './config.ts';
import type { CardRarity, Rarity } from './items.ts';
import { emptyWalk, localDate, type WalkState } from './walk.ts';
import { stationItemId } from './gacha.ts';

export const SCHEMA_VERSION = 1;
const KEY = 'trip-gacha:save';

export interface SaveData {
  schemaVersion: number;
  /** itemId -> 持っている数と、初めて手に入れた日時 */
  collection: Record<string, { count: number; firstAcquiredAt: number }>;
  /** spotId -> 最後に回した日時と回数 */
  spots: Record<string, { lastSpunAt: number; spinCount: number }>;
  /** spotId -> その駅の範囲内に最後にいた日時。回す権利の判定に使う(0.1.2 で追加。古い記録には無い) */
  visitedAt: Record<string, number>;
  /** spotId -> 範囲内に最後にいたときの、その日の移動距離。範囲の外で回すときはこの距離で確率を決める(0.1.10 で追加。古い記録には無い) */
  visitedDistanceM: Record<string, number>;
  shards: number;
  totalSpins: number;
  walk: WalkState;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const emptySave = (): SaveData => ({
  schemaVersion: SCHEMA_VERSION, collection: {}, spots: {}, visitedAt: {}, visitedDistanceM: {}, shards: 0, totalSpins: 0, walk: emptyWalk(),
});

/** 端末に保存できるか(プライベートブラウズなどで使えないことがある) */
export function storageAvailable(storage: StorageLike | undefined): boolean {
  try {
    if (!storage) return false;
    storage.setItem(KEY + ':test', '1');
    storage.removeItem(KEY + ':test');
    return true;
  } catch {
    return false;
  }
}

export function load(storage: StorageLike): SaveData {
  try {
    const text = storage.getItem(KEY);
    return text ? parseSave(text) : emptySave();
  } catch {
    // 保存が壊れていても起動はする(上書きはしない。次に保存したときに置き換わる)
    return emptySave();
  }
}

export function save(storage: StorageLike, data: SaveData): void {
  storage.setItem(KEY, JSON.stringify(data));
}

export const exportJson = (data: SaveData): string => JSON.stringify(data, null, 1);

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** 書き出したファイルの中身を読む。形が違えば理由つきで Error を投げる(呼び出し側は今の記録を残す) */
export function parseSave(text: string): SaveData {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('ファイルが JSON の形になっていません');
  }
  if (!isObj(raw)) throw new Error('記録の形が違います');
  if (raw.schemaVersion !== SCHEMA_VERSION) throw new Error('記録の版が違います');
  const { collection, spots, shards, totalSpins, walk } = raw;
  const visitedAt = raw.visitedAt ?? {};
  const visitedDistanceM = raw.visitedDistanceM ?? {};
  if (!isObj(collection) || !Object.values(collection).every((e) => isObj(e) && isNum(e.count) && e.count >= 1 && isNum(e.firstAcquiredAt))) {
    throw new Error('カードの記録が壊れています');
  }
  if (!isObj(spots) || !Object.values(spots).every((e) => isObj(e) && isNum(e.lastSpunAt) && isNum(e.spinCount))) {
    throw new Error('駅の記録が壊れています');
  }
  if (!isObj(visitedAt) || !Object.values(visitedAt).every(isNum)) throw new Error('駅に寄った記録が壊れています');
  if (!isObj(visitedDistanceM) || !Object.values(visitedDistanceM).every((v) => isNum(v) && v >= 0)) throw new Error('寄ったときの移動距離の記録が壊れています');
  if (!isNum(shards) || shards < 0 || !isNum(totalSpins) || totalSpins < 0) throw new Error('かけらか回した回数が壊れています');
  if (!isObj(walk) || !isNum(walk.dailyDistanceM) || typeof walk.distanceDate !== 'string') throw new Error('移動距離の記録が壊れています');
  const point = (v: unknown) => isObj(v) && isNum(v.lat) && isNum(v.lon) && isNum(v.accM) ? { lat: v.lat, lon: v.lon, accM: v.accM } : null;
  return {
    schemaVersion: SCHEMA_VERSION,
    collection: collection as SaveData['collection'],
    spots: spots as SaveData['spots'],
    visitedAt: visitedAt as SaveData['visitedAt'],
    visitedDistanceM: visitedDistanceM as SaveData['visitedDistanceM'],
    shards, totalSpins,
    walk: { dailyDistanceM: walk.dailyDistanceM, distanceDate: walk.distanceDate, smooth: point(walk.smooth), anchor: point(walk.anchor) },
  };
}

/** あと何ミリ秒で回せるか。0 なら回せる。端末の時計が戻されて最後に回した日時が未来なら、回せることにする */
export function cooldownRemainingMs(data: SaveData, spotId: string, now: number): number {
  const last = data.spots[spotId]?.lastSpunAt;
  if (last == null || last > now) return 0;
  return Math.max(0, last + CONFIG.cooldownMs - now);
}

/** 範囲内にいる場所に「いた」と、そのときの移動距離を記録した新しい記録を返す。範囲内の場所がなければ同じ記録を返す */
export function markVisited(data: SaveData, spotIds: string[], now: number, distanceM: number): SaveData {
  if (spotIds.length === 0) return data;
  const visitedAt = { ...data.visitedAt };
  const visitedDistanceM = { ...data.visitedDistanceM };
  for (const id of spotIds) {
    visitedAt[id] = now;
    visitedDistanceM[id] = distanceM;
  }
  return { ...data, visitedAt, visitedDistanceM };
}

/**
 * 回すときの確率に使う移動距離。範囲内なら今の距離。範囲の外なら、今日その範囲を出たときの距離
 * (出たあとに歩いても、その場所の確率は上がらない)。記録が無ければ(0.1.9 までに寄った場所)今の距離
 */
export function spinDistanceM(data: SaveData, spotId: string, inside: boolean, currentM: number, now: number): number {
  if (inside) return currentM;
  const visited = data.visitedAt[spotId];
  const saved = data.visitedDistanceM[spotId];
  if (visited == null || saved == null || localDate(visited) !== localDate(now)) return currentM;
  return saved;
}

/**
 * 回す権利があるか。今日その駅の範囲内にいて、しかも最後に回してから待ち時間が終わった後にいたなら、ある(範囲の外でも回せる)。
 * 待ち時間の間に範囲内にいただけでは戻らない(回した直後はまだ範囲内にいるため、それで戻すと離れても回せてしまう)。
 * 端末の時計が戻されて最後に回した日時が未来なら、回したことがない扱いにする(cooldownRemainingMs と同じ)。
 */
export function hasTicket(data: SaveData, spotId: string, now: number): boolean {
  const visited = data.visitedAt[spotId];
  if (visited == null || localDate(visited) !== localDate(now)) return false;
  const last = data.spots[spotId]?.lastSpunAt;
  return last == null || last > now || visited >= last + CONFIG.cooldownMs;
}

export interface SpinResult {
  itemId: string;
  rarity: CardRarity;
  isNew: boolean;
  /** 増えたかけら。裏カードでは減った分がマイナスで入る */
  shardsGained: number;
}

/** 裏カードが出たあとのかけら。初めてなら0に、かぶりなら半分(端数は切り捨て)にする */
const shardsAfterSecret = (shards: number, owned: boolean) => owned ? Math.floor(shards / 2) : 0;

/** 回した結果を記録に反映した新しい記録を返す。itemId を省くと、その駅のカード */
export function applySpin(
  data: SaveData, spotId: string, rarity: CardRarity, now: number, itemId = stationItemId(spotId, rarity as Rarity),
): { data: SaveData; result: SpinResult } {
  const owned = data.collection[itemId];
  const shardsGained = rarity === 'SECRET'
    ? shardsAfterSecret(data.shards, !!owned) - data.shards
    : owned ? CONFIG.shardsFor[rarity] : 0;
  const spot = data.spots[spotId];
  return {
    data: {
      ...data,
      collection: { ...data.collection, [itemId]: owned ? { ...owned, count: owned.count + 1 } : { count: 1, firstAcquiredAt: now } },
      spots: { ...data.spots, [spotId]: { lastSpunAt: now, spinCount: (spot?.spinCount ?? 0) + 1 } },
      shards: data.shards + shardsGained,
      totalSpins: data.totalSpins + 1,
    },
    result: { itemId, rarity, isNew: !owned, shardsGained },
  };
}

export interface Spin { spotId: string; rarity: CardRarity; itemId: string }

/**
 * 何か所かをまとめて回した結果を、1か所ずつ順に回したのと同じように記録する(同じ回で同じカードが2回出たら2枚目はかぶり)。
 * 1か所引くたびに記録してから次を引く(drawFor にはその時点の記録を渡す)。前の場所で増減したかけらが、次の裏カードの確率に効くように
 */
export function applySpins(
  data: SaveData, spotIds: string[], now: number, drawFor: (data: SaveData, spotId: string) => Spin,
): { data: SaveData; results: (SpinResult & { spotId: string })[] } {
  const results: (SpinResult & { spotId: string })[] = [];
  for (const spotId of spotIds) {
    const s = drawFor(data, spotId);
    const r = applySpin(data, s.spotId, s.rarity, now, s.itemId);
    data = r.data;
    results.push({ ...r.result, spotId: s.spotId });
  }
  return { data, results };
}
