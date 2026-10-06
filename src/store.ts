import { CONFIG } from './config.ts';
import type { Rarity } from './items.ts';
import { emptyWalk, type WalkState } from './walk.ts';
import { stationItemId } from './gacha.ts';

export const SCHEMA_VERSION = 1;
const KEY = 'trip-gacha:save';

export interface SaveData {
  schemaVersion: number;
  /** itemId -> 持っている数と、初めて手に入れた日時 */
  collection: Record<string, { count: number; firstAcquiredAt: number }>;
  /** spotId -> 最後に回した日時と回数 */
  spots: Record<string, { lastSpunAt: number; spinCount: number }>;
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
  schemaVersion: SCHEMA_VERSION, collection: {}, spots: {}, shards: 0, totalSpins: 0, walk: emptyWalk(),
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
  if (!isObj(collection) || !Object.values(collection).every((e) => isObj(e) && isNum(e.count) && e.count >= 1 && isNum(e.firstAcquiredAt))) {
    throw new Error('カードの記録が壊れています');
  }
  if (!isObj(spots) || !Object.values(spots).every((e) => isObj(e) && isNum(e.lastSpunAt) && isNum(e.spinCount))) {
    throw new Error('駅の記録が壊れています');
  }
  if (!isNum(shards) || shards < 0 || !isNum(totalSpins) || totalSpins < 0) throw new Error('かけらか回した回数が壊れています');
  if (!isObj(walk) || !isNum(walk.dailyDistanceM) || typeof walk.distanceDate !== 'string') throw new Error('移動距離の記録が壊れています');
  const point = (v: unknown) => isObj(v) && isNum(v.lat) && isNum(v.lon) && isNum(v.accM) ? { lat: v.lat, lon: v.lon, accM: v.accM } : null;
  return {
    schemaVersion: SCHEMA_VERSION,
    collection: collection as SaveData['collection'],
    spots: spots as SaveData['spots'],
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

export interface SpinResult {
  itemId: string;
  rarity: Rarity;
  isNew: boolean;
  shardsGained: number;
}

/** 駅で回した結果を記録に反映した新しい記録を返す */
export function applySpin(data: SaveData, spotId: string, rarity: Rarity, now: number): { data: SaveData; result: SpinResult } {
  const itemId = stationItemId(spotId, rarity);
  const owned = data.collection[itemId];
  const shardsGained = owned ? CONFIG.shardsFor[rarity] : 0;
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
