import { localDate } from './walk.ts';

/** 日記に残す日数(今日を入れて) */
export const DIARY_DAYS = 90;
/** 1日のコメントの最大の長さ(文字) */
export const DIARY_NOTE_MAX = 500;
/** どのバス停か分からない通過の回数で回した分の場所 */
export const BUS_PASS_SPOT = 'bus-pass';

/** 回した1回。t は回した時刻(epoch ミリ秒)、spotId は場所(通過の回数で回したときは BUS_PASS_SPOT) */
export interface DiaryEntry { t: number; spotId: string }

export interface DiaryDay { date: string; entries: DiaryEntry[] }

/** 残す一番古い時刻。今日を含めて DIARY_DAYS 日分の、最初の日の0時 */
export function diaryCutoff(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (DIARY_DAYS - 1));
  return d.getTime();
}

/** 1回分を足し、残す日数より古い分を消した新しい一覧を返す */
export function addDiary(diary: DiaryEntry[], spotId: string, now: number): DiaryEntry[] {
  const cutoff = diaryCutoff(now);
  return [...diary.filter((e) => e.t >= cutoff), { t: now, spotId }];
}

/** 日ごとにまとめる。日は新しい順、日の中は時刻順。残す日数より古い分は含めない */
export function diaryDays(diary: DiaryEntry[], now: number): DiaryDay[] {
  const cutoff = diaryCutoff(now);
  const days = new Map<string, DiaryEntry[]>();
  for (const e of [...diary].sort((a, b) => a.t - b.t)) {
    if (e.t < cutoff) continue;
    const date = localDate(e.t);
    days.set(date, [...(days.get(date) ?? []), e]);
  }
  return [...days.entries()].map(([date, entries]) => ({ date, entries })).sort((a, b) => b.date.localeCompare(a.date));
}

/** 日付(YYYY-MM-DD)→その日のコメント */
export type DiaryNotes = Record<string, string>;

/** 残す日数より古い日のコメントを消した新しい一覧を返す(日付は YYYY-MM-DD なので、文字の並びで比べられる) */
export function pruneNotes(notes: DiaryNotes, now: number): DiaryNotes {
  const oldest = localDate(diaryCutoff(now));
  return Object.fromEntries(Object.entries(notes).filter(([date]) => date >= oldest));
}

const clip = (text: string): string => [...text.trim()].slice(0, DIARY_NOTE_MAX).join('');

/** その日のコメントを書き換えた新しい一覧を返す。前後の空白を除き、空なら消す。長すぎれば最大の長さで切る */
export function setNote(notes: DiaryNotes, date: string, text: string, now: number): DiaryNotes {
  const next = { ...pruneNotes(notes, now) };
  const t = clip(text);
  if (t === '') delete next[date];
  else next[date] = t;
  return next;
}

const DATE_KEY = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

/** 書き出したファイルのコメントを読む。項目が無い(古い記録)・形が違うものは捨てて、読めた分だけ返す */
export function parseNotes(raw: unknown): DiaryNotes {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  const out: DiaryNotes = {};
  for (const [date, text] of Object.entries(raw)) {
    if (!DATE_KEY.test(date) || typeof text !== 'string') continue;
    const t = clip(text);
    if (t !== '') out[date] = t;
  }
  return out;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** 書き出したファイルの日記を読む。項目が無い(古い記録)・形が違う行は捨てて、読めた分だけ返す */
export function parseDiary(raw: unknown): DiaryEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((e: unknown) =>
    isObj(e) && typeof e.t === 'number' && Number.isFinite(e.t) && typeof e.spotId === 'string' && e.spotId !== '' ? [{ t: e.t, spotId: e.spotId }] : []);
}
