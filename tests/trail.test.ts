import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addFix, emptyWalk, type WalkState } from '../src/walk.ts';
import { createTrailStore, formatPoint, monthKey, parseTrail, readTrailExport, splitLines, trailPoint, withTrail, type TrailFiles, type TrailPoint } from '../src/trail.ts';
import { M_PER_DEG_LAT, seededRandom } from './helpers.ts';

const LAT = 35.6559, LON = 139.3389;
const T0 = new Date(2026, 10, 20, 9, 0, 0).getTime();
const pt = (i: number, t = T0 + i * 60_000): TrailPoint => ({ lat: LAT + i * 0.0003, lon: LON, t });

/** 偽のファイル置き場。書いた順を覚えておく */
function fakeFiles(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  const log: string[] = [];
  const files: TrailFiles = {
    months: async () => [...store.keys()].sort(),
    read: async (m) => { if (!store.has(m)) throw new Error('no file'); return store.get(m)!; },
    write: async (m, t) => { log.push(`write ${m}`); store.set(m, t); },
    append: async (m, t) => {
      if (!store.has(m)) throw new Error('append before write');
      log.push(`append ${m}`);
      store.set(m, store.get(m)! + t);
    },
  };
  return { files, store, log };
}

test('起点が進んだときだけ点になり、止まっている間は点が増えない', () => {
  const rand = seededRandom(7);
  const g = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
  let s: WalkState = emptyWalk();
  let n = 0;
  for (let i = 0; i < 600; i++) {
    const fix = { lat: LAT + (g() * 4) / M_PER_DEG_LAT, lon: LON, accuracyM: 8, t: T0 + i * 1000 };
    const next = addFix(s, fix);
    if (trailPoint(s, next, fix)) n++;
    s = next;
  }
  // 最初の1点だけ。10分止まっていてGPSが揺れても線は伸びない
  assert.equal(n, 1);
});

test('歩くと、15m以上進むごとに点になる', () => {
  let s: WalkState = emptyWalk();
  const points: TrailPoint[] = [];
  for (let i = 0; i <= 200; i++) {
    const fix = { lat: LAT + (i * 1.3) / M_PER_DEG_LAT, lon: LON, accuracyM: null, t: T0 + i * 1000 };
    const next = addFix(s, fix);
    const p = trailPoint(s, next, fix);
    if (p) points.push(p);
    s = next;
  }
  // 260m 歩いた: 最初の1点 + 約15mごと
  assert.ok(points.length >= 12 && points.length <= 22, `点が ${points.length} 個`);
});

test('精度が悪い測位は点にならない', () => {
  const fix = { lat: LAT, lon: LON, accuracyM: 500, t: T0 };
  assert.equal(trailPoint(emptyWalk(), addFix(emptyWalk(), fix), fix), null);
});

test('点は1行の文字にして読み戻せる。壊れた行は読み飛ばす', () => {
  const p = { lat: 35.65591, lon: 139.33892, t: T0 };
  const text = `${formatPoint(p)}\n途切れた行,12\nabc,def,1\n${formatPoint({ ...p, t: T0 + 5000 })}\n35.6,139.3`;
  const back = parseTrail(text);
  assert.equal(back.length, 2);
  assert.deepEqual(back[0], { lat: 35.65591, lon: 139.33892, t: Math.round(T0 / 1000) * 1000 });
});

test('10分より長く空いたら線を切る。ちょうど10分はつなぐ', () => {
  const at = (i: number, min: number): TrailPoint => ({ lat: LAT + i * 0.0003, lon: LON, t: T0 + min * 60_000 });
  // 0分・1分・11分(ちょうど10分空き=つなぐ)・12分 | 22分1ミリ秒(10分より空く=切る)・23分
  const lines = splitLines([at(0, 0), at(1, 1), at(2, 11), at(3, 12), { ...at(4, 22), t: T0 + 22 * 60_000 + 1 }, at(5, 23)]);
  assert.equal(lines.length, 2);
  assert.equal(lines[0].length, 4);
  assert.equal(lines[1].length, 2);
});

test('日付が変わったら線を切る', () => {
  const lateNight = new Date(2026, 10, 20, 23, 58, 0).getTime();
  const lines = splitLines([
    { lat: LAT, lon: LON, t: lateNight },
    { lat: LAT + 0.0003, lon: LON, t: lateNight + 60_000 },
    { lat: LAT + 0.0006, lon: LON, t: lateNight + 3 * 60_000 },
    { lat: LAT + 0.0009, lon: LON, t: lateNight + 4 * 60_000 },
  ]);
  assert.equal(lines.length, 2);
});

test('1点だけの線は描かない', () => {
  assert.deepEqual(splitLines([pt(0)]), []);
});

test('点を足すと、最初は新しいファイルを作り、次からは末尾に足す', async () => {
  const { files, store, log } = fakeFiles();
  const trail = createTrailStore(files);
  await trail.load();
  trail.add(pt(0));
  trail.add(pt(1));
  trail.add(pt(2));
  await new Promise((r) => setTimeout(r, 10));
  assert.deepEqual(log, ['write 2026-11', 'append 2026-11', 'append 2026-11']);
  assert.equal(parseTrail(store.get('2026-11')!).length, 3);
});

test('月が変わると新しいファイルになる', async () => {
  const { files, log } = fakeFiles();
  const trail = createTrailStore(files);
  await trail.load();
  trail.add({ lat: LAT, lon: LON, t: new Date(2026, 10, 30, 23, 0, 0).getTime() });
  trail.add({ lat: LAT + 0.0003, lon: LON, t: new Date(2026, 11, 1, 1, 0, 0).getTime() });
  await new Promise((r) => setTimeout(r, 10));
  assert.deepEqual(log, ['write 2026-11', 'write 2026-12']);
});

test('前の点より古い・同じ時刻の点は捨てる', async () => {
  const { files, store } = fakeFiles();
  const trail = createTrailStore(files);
  await trail.load();
  trail.add(pt(5));
  trail.add(pt(3));
  trail.add(pt(5));
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(parseTrail(store.get('2026-11')!).length, 1);
  assert.equal(trail.count, 1);
});

test('起動すると、しまってある月を全部読んで時刻順に並べる', async () => {
  const a = `${formatPoint(pt(0, new Date(2026, 9, 31, 12).getTime()))}\n`;
  const b = `${formatPoint(pt(1))}\n${formatPoint(pt(2))}\n`;
  const { files } = fakeFiles({ '2026-11': b, '2026-10': a, '2026-09': '壊れたファイル' });
  const trail = createTrailStore(files);
  await trail.load();
  assert.equal(trail.count, 3);
});

test('何も無いフォルダでも、読めない月があっても起動できる', async () => {
  const trail = createTrailStore({ months: async () => { throw new Error('no dir'); }, read: async () => '', write: async () => {}, append: async () => {} });
  await trail.load();
  assert.equal(trail.count, 0);
  assert.deepEqual(trail.lines().lines, []);
});

test('書き込みに失敗しても、続けて点を足せる', async () => {
  let fail = true;
  const trail = createTrailStore({ months: async () => [], read: async () => '', write: async () => { if (fail) { fail = false; throw new Error('disk full'); } }, append: async () => {} });
  await trail.load();
  trail.add(pt(0));
  trail.add(pt(1));
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(trail.count, 2);
});

test('書き出しは月ごと。読み込みは今の点と合わせ、同じ時刻は1つにする', async () => {
  const { files, store } = fakeFiles();
  const trail = createTrailStore(files);
  await trail.load();
  trail.add(pt(0));
  trail.add(pt(1));
  const months = trail.exportMonths();
  assert.deepEqual(Object.keys(months), ['2026-11']);

  const other = fakeFiles();
  const restored = createTrailStore(other.files);
  await restored.load();
  restored.add(pt(1));
  restored.add(pt(2));
  await restored.merge(months);
  assert.equal(restored.count, 3);
  assert.equal(parseTrail(other.store.get('2026-11')!).length, 3);
  // 元の置き場は触らない
  assert.equal(parseTrail(store.get('2026-11')!).length, 2);
});

test('書き出しの JSON に足して、読み込みで取り出せる。無い・壊れていれば空', () => {
  const months = { '2026-11': `${formatPoint(pt(0))}\n` };
  const json = withTrail(JSON.stringify({ schemaVersion: 1 }), months);
  assert.deepEqual(readTrailExport(json), months);
  assert.deepEqual(readTrailExport(JSON.stringify({ schemaVersion: 1 })), {});
  assert.deepEqual(readTrailExport('{'), {});
  assert.deepEqual(readTrailExport(JSON.stringify({ trail: { bad: 'x', '2026-11': 5 } })), {});
});

test('月の名前は端末の時刻で決まる', () => {
  assert.equal(monthKey(new Date(2026, 11, 1, 0, 30).getTime()), '2026-12');
  assert.equal(monthKey(new Date(2026, 10, 30, 23, 30).getTime()), '2026-11');
});
