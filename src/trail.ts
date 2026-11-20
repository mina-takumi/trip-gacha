import { CONFIG } from './config.ts';
import type { Fix } from './geofence.ts';
import { localDate, type WalkState } from './walk.ts';

/** 歩いた道の1点。t は ms(秒に丸める) */
export interface TrailPoint { lat: number; lon: number; t: number }

/**
 * 移動距離の計算で「起点が進んだ」とき、その場所を線の点にする。
 * ぶれの弾き方は移動距離と同じ(止まっている間は起点が進まないので、点も増えない)
 */
export function trailPoint(prev: WalkState, next: WalkState, fix: Fix): TrailPoint | null {
  if (!next.anchor || next.anchor === prev.anchor) return null;
  return { lat: next.anchor.lat, lon: next.anchor.lon, t: fix.t };
}

const roundPoint = (p: TrailPoint): TrailPoint => ({ lat: Math.round(p.lat * 1e5) / 1e5, lon: Math.round(p.lon * 1e5) / 1e5, t: Math.round(p.t / 1000) * 1000 });

/** 1点を1行にする。ファイルの末尾に足していくので、1行で1点 */
export const formatPoint = (p: TrailPoint): string => `${p.lat.toFixed(5)},${p.lon.toFixed(5)},${Math.round(p.t / 1000)}`;

/** 月ごとのファイルの中身を点にする。形が違う行は読み飛ばす(書き込み中に途切れた行など) */
export function parseTrail(text: string): TrailPoint[] {
  const out: TrailPoint[] = [];
  for (const row of text.split('\n')) {
    const [a, b, c, ...rest] = row.trim().split(',');
    if (rest.length || c == null) continue;
    const lat = Number(a), lon = Number(b), sec = Number(c);
    if (![lat, lon, sec].every(Number.isFinite) || Math.abs(lat) > 90 || Math.abs(lon) > 180 || sec <= 0) continue;
    out.push({ lat, lon, t: sec * 1000 });
  }
  return out;
}

/** 'YYYY-MM'(端末の時刻で) */
export const monthKey = (t: number): string => localDate(t).slice(0, 7);

/** 日付が変わったとき、前の点から trailGapMs より空いたときに線を切る。2点に満たない線は描けないので外す */
export function splitLines(points: TrailPoint[]): [number, number][][] {
  const lines: [number, number][][] = [];
  let cur: [number, number][] = [];
  let prev: TrailPoint | null = null;
  for (const p of points) {
    if (prev && (p.t - prev.t > CONFIG.trailGapMs || localDate(p.t) !== localDate(prev.t))) {
      if (cur.length >= 2) lines.push(cur);
      cur = [];
    }
    cur.push([p.lat, p.lon]);
    prev = p;
  }
  if (cur.length >= 2) lines.push(cur);
  return lines;
}

/** 月ごとのファイルを読み書きする道具。アプリ版では Filesystem、テストでは偽物に差し替える */
export interface TrailFiles {
  /** 月('YYYY-MM')の一覧 */
  months(): Promise<string[]>;
  read(month: string): Promise<string>;
  /** ファイルを作る(あれば置き換える) */
  write(month: string, text: string): Promise<void>;
  /** ファイルの末尾に足す(ファイルがあるときだけ呼ぶ) */
  append(month: string, text: string): Promise<void>;
}

/**
 * 歩いた道の記録。点は手元に持ち、書くときは末尾に1行足すだけにする(位置が届くたびに全部を書き直さない)。
 * 書き込みは順番に並べ、失敗しても遊びは続ける
 */
export function createTrailStore(files: TrailFiles) {
  let points: TrailPoint[] = [];
  const known = new Set<string>();
  let queue: Promise<void> = Promise.resolve();
  let version = 0;
  let cached: { version: number; lines: [number, number][][] } | null = null;

  const enqueue = (job: () => Promise<void>) => {
    queue = queue.then(job).catch(() => {});
    return queue;
  };

  return {
    /** 起動時に、しまってある月を全部読む。読めない月は飛ばす */
    async load(): Promise<void> {
      const all: TrailPoint[] = [];
      let months: string[] = [];
      try { months = await files.months(); } catch { /* まだ何も無い */ }
      for (const m of months) {
        try {
          all.push(...parseTrail(await files.read(m)));
          known.add(m);
        } catch { /* 読めない月は飛ばす */ }
      }
      all.sort((a, b) => a.t - b.t);
      points = all.filter((p, i) => i === 0 || p.t > all[i - 1].t);
      version++;
    },

    /** 点を足す。前の点より新しくなければ捨てる(古い測位が遅れて届いたとき、同じ場所の重複) */
    add(raw: TrailPoint): void {
      const p = roundPoint(raw);
      const last = points[points.length - 1];
      if (last && p.t <= last.t) return;
      points.push(p);
      version++;
      const month = monthKey(p.t), row = `${formatPoint(p)}\n`;
      void enqueue(async () => {
        if (known.has(month)) await files.append(month, row);
        else { await files.write(month, row); known.add(month); }
      });
    },

    /** 描く線。点が増えるまで同じものを返す */
    lines(): { version: number; lines: [number, number][][] } {
      if (!cached || cached.version !== version) cached = { version, lines: splitLines(points) };
      return cached;
    },

    get count(): number { return points.length; },

    /** 書き出し用。月ごとのファイルの中身 */
    exportMonths(): Record<string, string> {
      const out: Record<string, string> = {};
      for (const p of points) {
        const m = monthKey(p.t);
        out[m] = (out[m] ?? '') + `${formatPoint(p)}\n`;
      }
      return out;
    },

    /** 読み込み用。今の点と合わせる(同じ時刻は1つに)。読み込んだ月のファイルを書き直す */
    async merge(months: Record<string, string>): Promise<void> {
      const incoming = Object.values(months).flatMap(parseTrail).map(roundPoint);
      if (!incoming.length) return;
      const touched = new Set(incoming.map((p) => monthKey(p.t)));
      const merged = [...points, ...incoming].sort((a, b) => a.t - b.t).filter((p, i, a) => i === 0 || p.t > a[i - 1].t);
      points = merged;
      version++;
      await enqueue(async () => {
        for (const m of touched) {
          await files.write(m, merged.filter((p) => monthKey(p.t) === m).map((p) => `${formatPoint(p)}\n`).join(''));
          known.add(m);
        }
      });
    },
  };
}

export type TrailStore = ReturnType<typeof createTrailStore>;

/** 書き出しの JSON に、歩いた道を足す */
export const withTrail = (json: string, months: Record<string, string>): string =>
  JSON.stringify({ ...JSON.parse(json), trail: months }, null, 1);

/** 読み込むファイルの中の歩いた道('YYYY-MM' → 中身)。無い・形が違うときは空 */
export function readTrailExport(text: string): Record<string, string> {
  try {
    const raw = JSON.parse(text)?.trail;
    if (!raw || typeof raw !== 'object') return {};
    return Object.fromEntries(Object.entries(raw).filter(([k, v]) => /^\d{4}-\d{2}$/.test(k) && typeof v === 'string')) as Record<string, string>;
  } catch {
    return {};
  }
}
