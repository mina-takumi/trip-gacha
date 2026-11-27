import { diaryCutoff, pruneNotes, type DiaryEntry } from './diary.ts';
import { emptyWalk } from './walk.ts';
import { exportJson, type SaveData } from './store.ts';

/**
 * サーバーに置く記録の文字(JSON)。この端末の中だけで使うものは入れない:
 * 最後にいた位置(lastFix)・閉じている間の区間(pending)・ならした現在地と距離の起点(walk)は位置そのものなので送らない
 */
export function toRemoteJson(save: SaveData): string {
  return exportJson({ ...save, lastFix: null, pending: [], walk: emptyWalk() });
}

/**
 * まだ何も遊んでいない記録(カード・かけら・回した回数・友達の駅が無い)。合わせるとき、これは「古い」ものとして扱う。
 * 新しい端末の空の記録でサーバーの記録を消さないため。駅に寄っただけ(visitedAt)では「遊んだ」に数えない
 */
export function isPristine(s: SaveData): boolean {
  return Object.keys(s.collection).length === 0 && s.totalSpins === 0 && s.shards === 0 && Object.keys(s.friendCards).length === 0;
}

/** キーの順番が違っても同じ文字になるようにする */
const canonical = (v: unknown): string => JSON.stringify(v, (_, x) =>
  x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1))) : x);

/**
 * ログインしたとき、どちらを残すか利用者に選んでもらうか。両方に遊んだ記録があって、中身が違うときだけ。
 * 比べるのは利用者が作った中身だけ(駅に寄っただけの違いは、聞かずに合わせる)
 */
export function needsChoice(local: SaveData, remote: SaveData): boolean {
  if (isPristine(local) || isPristine(remote)) return false;
  const content = (s: SaveData) => canonical([s.collection, s.shards, s.totalSpins, s.friendCards, s.diaryNotes]);
  return content(local) !== content(remote);
}

const maxOf = (a: number | undefined, b: number | undefined) => Math.max(a ?? -Infinity, b ?? -Infinity);
const minOf = (a: number | undefined, b: number | undefined) => Math.min(a ?? Infinity, b ?? Infinity);

function union<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T | undefined, y: T | undefined, key: string) => T): Record<string, T> {
  const out: Record<string, T> = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out[k] = pick(a[k], b[k], k);
  return out;
}

/**
 * この端末の記録(local)とサーバーの記録(remote)を1つに合わせる。
 * - カード: 両方が持っているものを全部残す(数は多い方、初めて手に入れた日時は早い方)
 * - かけら・回した回数: 新しく保存した方(savedAt が大きい方。同じならサーバー)の値。何も遊んでいない記録は、いちばん古いものとして扱う
 * - 駅に寄った記録・回した記録・もらった報酬・友達の駅: 両方を足し合わせる
 * - 日記: 両方の1回ごとを足す(同じ時刻・同じ場所は1つ)。コメントは日付ごとに足し、同じ日が違えば新しい方
 * - 位置まわり(最後の位置・閉じている間の区間・今日の移動距離)は、この端末のもの
 */
export function mergeSaves(local: SaveData, remote: SaveData, localSavedAt: number, remoteSavedAt: number, now: number): SaveData {
  const l = isPristine(local) ? 0 : localSavedAt;
  const r = isPristine(remote) ? 0 : remoteSavedAt;
  // 同じ時刻ならサーバーを選ぶ(読み込みで保存時刻は進めないので、古い記録を読み込んでもサーバーのかけら・回数が戻る)
  const newer = l > r ? local : remote;

  const collection = union(local.collection, remote.collection, (x, y) => ({
    count: maxOf(x?.count, y?.count),
    firstAcquiredAt: minOf(x?.firstAcquiredAt, y?.firstAcquiredAt),
  }));
  const spots = union(local.spots, remote.spots, (x, y) => {
    const last = (x?.lastSpunAt ?? -1) >= (y?.lastSpunAt ?? -1) ? x! : y!;
    return { lastSpunAt: last.lastSpunAt, spinCount: maxOf(x?.spinCount, y?.spinCount) };
  });
  const visitedAt = union(local.visitedAt, remote.visitedAt, (x, y) => maxOf(x, y));
  // 寄ったときの距離は、寄った日時が新しい方の値(片方にしか無ければそれ)
  const visitedDistanceM: Record<string, number> = {};
  for (const k of Object.keys(visitedAt)) {
    const fromLocal = (local.visitedAt[k] ?? -1) >= (remote.visitedAt[k] ?? -1);
    const v = fromLocal ? local.visitedDistanceM[k] ?? remote.visitedDistanceM[k] : remote.visitedDistanceM[k] ?? local.visitedDistanceM[k];
    if (v !== undefined) visitedDistanceM[k] = v;
  }

  const cutoff = diaryCutoff(now);
  const seen = new Set<string>();
  const diary: DiaryEntry[] = [...local.diary, ...remote.diary]
    .filter((e) => e.t >= cutoff && !seen.has(`${e.t}|${e.spotId}`) && !!seen.add(`${e.t}|${e.spotId}`))
    .sort((a, b) => a.t - b.t);
  // 同じ日のコメントが違えば、新しく保存した方。残す日数より古い日は消す
  const diaryNotes = pruneNotes({ ...remote.diaryNotes, ...local.diaryNotes, ...newer.diaryNotes }, now);

  return {
    ...local,
    collection, spots, visitedAt, visitedDistanceM, diary, diaryNotes,
    shards: newer.shards,
    totalSpins: newer.totalSpins,
    passedAt: union(local.passedAt, remote.passedAt, (x, y) => maxOf(x, y)),
    rewards: union(local.rewards, remote.rewards, (x, y) => minOf(x, y)),
    friendCards: union(local.friendCards, remote.friendCards, (x, y) => minOf(x, y)),
    friendQueue: newer.friendQueue,
    friendWeek: local.friendWeek >= remote.friendWeek ? local.friendWeek : remote.friendWeek,
  };
}
