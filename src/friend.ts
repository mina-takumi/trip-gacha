import { RARITIES } from './config.ts';
import { stationItemId } from './gacha.ts';
import type { Rarity } from './items.ts';
import { applySpin, type SaveData, type SpinResult } from './store.ts';
import { localDate } from './walk.ts';

/** QRの先頭の目印。中身を変えるときは版を上げる */
const QR_TAG = 'TG1';

export const hasCard = (data: SaveData, spotId: string) => RARITIES.some((r) => data.collection[stationItemId(spotId, r)]);

/**
 * 自分で行って回した駅か。友達の駅で手に入れただけの駅は含めない(人づてに広がらないように)。
 * 場所ごとの回した記録がある駅と、その記録ができる前に手に入れたカードがある駅
 */
export const spunByMe = (data: SaveData, spotId: string) =>
  (data.spots[spotId]?.spinCount ?? 0) > 0 || (hasCard(data, spotId) && data.friendCards[spotId] == null);

/** 自分のQRの文字。駅の並び(order)の順に、自分で回したかを0/1で並べて16進にしたものだけ。名前・日時・カードは入らない */
export function encodeQr(order: string[], data: SaveData): string {
  const digits: number[] = Array.from({ length: Math.ceil(order.length / 4) }, () => 0);
  order.forEach((id, i) => {
    if (spunByMe(data, id)) digits[i >> 2] |= 8 >> (i & 3);
  });
  return `${QR_TAG}.${order.length}.${digits.map((d) => d.toString(16)).join('')}`;
}

/** QRの文字を読み解く。トリップガチャのQRでなければ null。bits[i] は、並びのi番目の駅を回したか */
export function decodeQr(text: string): boolean[] | null {
  const m = /^TG1\.(\d{1,4})\.([0-9a-f]+)$/.exec(text.trim());
  if (!m) return null;
  const n = Number(m[1]), hex = m[2];
  if (n < 1 || hex.length !== Math.ceil(n / 4)) return null;
  return Array.from({ length: n }, (_, i) => (parseInt(hex[i >> 2], 16) & (8 >> (i & 3))) !== 0);
}

/**
 * 友達のQRから、候補に足す駅。友達が回していて、自分がまだカードを持っていない駅。
 * 並び(order)が自分と友達で長さが違うとき(駅が増えたあと)は、どちらにもある先頭の分だけ見る
 */
export function friendStations(order: string[], bits: boolean[], data: SaveData): string[] {
  return order.filter((id, i) => i < bits.length && bits[i] && !hasCard(data, id));
}

/**
 * 今回読んだ1人分を候補にする(別のQRの分とは混ぜず、前の候補は入れ替える)。
 * 新しい駅が無いとき(まだ持っていない駅が0、または今の候補と同じ)は前の候補を残す。replaced は前の候補を入れ替えたか
 */
export function setBatch(data: SaveData, ids: string[]): { data: SaveData; added: number; replaced: boolean } {
  const cur = friendCandidates(data);
  const same = ids.length === cur.length && ids.every((id) => cur.includes(id));
  if (ids.length === 0 || same) return { data, added: 0, replaced: false };
  return { data: { ...data, friendQueue: [...ids] }, added: ids.length, replaced: cur.length > 0 };
}

/** 今の候補(読んだあとに自分で手に入れた駅は除く) */
export const friendCandidates = (data: SaveData) => data.friendQueue.filter((id) => !hasCard(data, id));

/** その日を含む週の月曜の日付(週は月曜0時で切り替わる) */
export function weekStart(now: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return localDate(d.getTime());
}

/** 今週まだ回していなくて、候補が1駅以上あるか */
export const canFriendSpin = (data: SaveData, now: number) => friendCandidates(data).length > 0 && data.friendWeek !== weekStart(now);

/**
 * 候補からランダムに1駅だけ回す(pick は 0 以上 n 未満の番号を返す)。残りの候補は消える。
 * 駅の待ち時間・回す権利・日記は変えず、行った駅にも数えない(friendCards に残す)。回せないときは null
 */
export function applyFriendSpin(
  data: SaveData, now: number, drawRarity: () => Rarity, pick: (n: number) => number = (n) => Math.floor(Math.random() * n),
): { data: SaveData; result: SpinResult & { spotId: string } } | null {
  if (!canFriendSpin(data, now)) return null;
  const candidates = friendCandidates(data);
  const spotId = candidates[Math.min(Math.max(pick(candidates.length), 0), candidates.length - 1)];
  const r = applySpin(data, spotId, drawRarity(), now);
  const cur = { ...r.data, spots: data.spots, diary: data.diary, diaryNotes: data.diaryNotes };
  return {
    data: { ...cur, friendQueue: [], friendWeek: weekStart(now), friendCards: { ...data.friendCards, [spotId]: now } },
    result: { ...r.result, spotId },
  };
}
