import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDiary, BUS_PASS_SPOT, DIARY_DAYS, DIARY_NOTE_MAX, diaryCutoff, diaryDays, parseDiary, parseNotes, pruneNotes, setNote } from '../src/diary.ts';
import { applyBusPassSpin, applyShardSpin, applySpin, applySpins, applyPassCount, emptySave, exportJson, parseSave } from '../src/store.ts';
import { localDate } from '../src/walk.ts';

const at = (y: number, m: number, d: number, h = 12, min = 0) => new Date(y, m - 1, d, h, min).getTime();
const DAY = 24 * 60 * 60 * 1000;

test('回した1回ごとに、時刻と場所が日記に1行ずつ足される', () => {
  const t1 = at(2026, 11, 12, 8, 12);
  const t2 = at(2026, 11, 12, 18, 30);
  let d = emptySave();
  ({ data: d } = applySpin(d, 'n1', 'NORMAL', t1));
  ({ data: d } = applySpin(d, 'n1', 'RARE', t2));
  assert.deepEqual(d.diary, [{ t: t1, spotId: 'n1' }, { t: t2, spotId: 'n1' }]);
});

test('4通りの回し方が、全部日記に載る', () => {
  const T = at(2026, 11, 12, 9);
  // 範囲内・まとめて回す
  const many = applySpins(emptySave(), ['a', 'b'], T, () => ({ spotId: 'x', rarity: 'NORMAL', itemId: 'common:1' }));
  assert.deepEqual(many.data.diary.map((e) => e.spotId), ['x', 'x']);
  // かけらで駅を回す
  const visited = { ...emptySave(), visitedAt: { s1: T }, shards: 300 };
  const shard = applyShardSpin(visited, 's1', 'NORMAL', T + 1000);
  assert.deepEqual(shard?.data.diary, [{ t: T + 1000, spotId: 's1' }]);
  // 通過の回数で回す(どのバス停か分からない)
  const pass = applyBusPassSpin(applyPassCount(emptySave(), T, 1), 'NORMAL', 'common:1', T + 2000);
  assert.deepEqual(pass?.data.diary, [{ t: T + 2000, spotId: BUS_PASS_SPOT }]);
  // 通過の回数で回しても、場所ごとの記録(待ち時間)は変わらない
  assert.deepEqual(pass?.data.spots, {});
});

test('残す日数より古い分は、足すときに消える', () => {
  const now = at(2026, 11, 12, 10);
  const oldest = diaryCutoff(now);
  assert.equal(localDate(oldest), localDate(now - (DIARY_DAYS - 1) * DAY));
  const diary = [{ t: oldest - 1, spotId: 'old' }, { t: oldest, spotId: 'edge' }, { t: now - DAY, spotId: 'new' }];
  assert.deepEqual(addDiary(diary, 'n1', now).map((e) => e.spotId), ['edge', 'new', 'n1']);
});

test('日ごとにまとめる: 日は新しい順、日の中は時刻順、古すぎる日は出ない', () => {
  const now = at(2026, 11, 12, 20);
  const diary = [
    { t: at(2026, 11, 12, 18), spotId: 'c' },
    { t: at(2026, 11, 11, 8), spotId: 'a' },
    { t: at(2026, 11, 12, 8), spotId: 'b' },
    { t: now - 200 * DAY, spotId: 'ancient' },
  ];
  const days = diaryDays(diary, now);
  assert.deepEqual(days.map((d) => d.date), ['2026-11-12', '2026-11-11']);
  assert.deepEqual(days[0].entries.map((e) => e.spotId), ['b', 'c']);
  assert.deepEqual(diaryDays([], now), []);
});

test('書き出し→読み込みで日記が戻る。古い書き出し(日記なし)も読める', () => {
  const T = at(2026, 11, 12, 9);
  const { data } = applySpin(emptySave(), 'n1', 'NORMAL', T);
  assert.deepEqual(parseSave(exportJson(data)).diary, [{ t: T, spotId: 'n1' }]);
  const { diary: _drop, ...old } = data;
  assert.deepEqual(parseSave(JSON.stringify(old)).diary, []);
});

test('壊れた行は捨てて、読める行だけ残す', () => {
  const ok = { t: 1_790_000_000_000, spotId: 'n1' };
  assert.deepEqual(parseDiary([ok, null, 5, { t: 'x', spotId: 'n1' }, { t: 1, spotId: '' }, { t: Infinity, spotId: 'n1' }, [], ok]), [ok, ok]);
  assert.deepEqual(parseDiary('nope'), []);
  assert.deepEqual(parseDiary(undefined), []);
});

test('コメントを書くと、その日のコメントになる。前後の空白は除き、空にすると消える', () => {
  const now = at(2026, 11, 12, 20);
  let n = setNote({}, '2026-11-12', '  駅で友だちに会った \n', now);
  assert.deepEqual(n, { '2026-11-12': '駅で友だちに会った' });
  n = setNote(n, '2026-11-11', 'きのう', now);
  assert.deepEqual(Object.keys(n).sort(), ['2026-11-11', '2026-11-12']);
  n = setNote(n, '2026-11-12', '   ', now);
  assert.deepEqual(n, { '2026-11-11': 'きのう' });
});

test('コメントは500文字で切れる(絵文字なども1文字として数える)', () => {
  const now = at(2026, 11, 12, 20);
  const long = '日'.repeat(DIARY_NOTE_MAX + 30);
  assert.equal([...setNote({}, '2026-11-12', long, now)['2026-11-12']].length, DIARY_NOTE_MAX);
  const emoji = String.fromCodePoint(0x1F600).repeat(DIARY_NOTE_MAX + 5);
  assert.equal([...setNote({}, '2026-11-12', emoji, now)['2026-11-12']].length, DIARY_NOTE_MAX);
});

test('90日より古い日のコメントは、場所といっしょに消える', () => {
  const now = at(2026, 11, 12, 20);
  const oldest = localDate(diaryCutoff(now));
  const old = localDate(diaryCutoff(now) - DAY);
  const notes = { [old]: '古い', [oldest]: 'ぎりぎり', '2026-11-12': '今日' };
  assert.deepEqual(Object.keys(pruneNotes(notes, now)).sort(), [oldest, '2026-11-12'].sort());
  // 回すと、そのとき古くなった日のコメントも消える
  const { data } = applySpin({ ...emptySave(), diaryNotes: notes }, 'n1', 'NORMAL', now);
  assert.equal(data.diaryNotes[old], undefined);
  assert.equal(data.diaryNotes['2026-11-12'], '今日');
});

test('コメントは書き出し→読み込みで戻る。古い書き出し(コメントなし)も読め、壊れた項目は捨てる', () => {
  const now = at(2026, 11, 12, 9);
  const withNote = { ...applySpin(emptySave(), 'n1', 'NORMAL', now).data, diaryNotes: { '2026-11-12': 'たのしかった' } };
  assert.deepEqual(parseSave(exportJson(withNote)).diaryNotes, { '2026-11-12': 'たのしかった' });
  const { diaryNotes: _drop, ...old } = withNote;
  assert.deepEqual(parseSave(JSON.stringify(old)).diaryNotes, {});
  assert.deepEqual(parseNotes({ '2026-11-12': 'ok', 'bad-key': 'x', '2026-11-11': 5, '2026-11-10': '   ', '2026-11-09': ['a'] }), { '2026-11-12': 'ok' });
  assert.deepEqual(parseNotes(null), {});
  assert.deepEqual(parseNotes([]), {});
});
