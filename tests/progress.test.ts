import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CITIES, claimRewards, LINES, progressOf, unclaimed } from '../src/progress.ts';
import { stationItemId } from '../src/gacha.ts';
import type { Spot } from '../src/items.ts';
import { emptySave, exportJson, parseSave, type SaveData } from '../src/store.ts';
import { CONFIG } from '../src/config.ts';

const { spots } = JSON.parse(readFileSync(new URL('../data/spots.json', import.meta.url), 'utf8')) as { spots: Spot[] };
const stations = spots.filter((s) => s.kind === 'station');
const T = 1_790_000_000_000;

/** 名前の駅に行った記録を付ける */
const visit = (data: SaveData, names: string[]): SaveData => {
  const visitedAt = { ...data.visitedAt };
  for (const n of names) for (const s of stations.filter((x) => x.name === n)) visitedAt[s.id] = T;
  return { ...data, visitedAt };
};
const find = (data: SaveData, key: string) => progressOf(data, stations).find((p) => p.key === key)!;

test('路線の表の駅名は、すべてアプリの駅にある(書き間違いを防ぐ)', () => {
  const names = new Set(stations.map((s) => s.name));
  for (const l of LINES) for (const n of l.stations) assert.ok(names.has(n), `${l.name}: ${n}`);
});

test('アプリの45駅は、どれもどこかの路線に入っている', () => {
  const inLine = new Set(LINES.flatMap((l) => l.stations));
  assert.equal(stations.length, 45);
  assert.deepEqual(stations.filter((s) => !inLine.has(s.name)).map((s) => s.name), []);
});

test('路線は13、市は4。全部そろうと路線580・市450のかけら', () => {
  assert.equal(LINES.length, 13);
  const all = progressOf(emptySave(), stations);
  assert.equal(all.filter((p) => p.kind === 'line').reduce((n, p) => n + p.reward, 0), 580);
  assert.equal(all.filter((p) => p.kind === 'city').reduce((n, p) => n + p.reward, 0), 450);
  assert.deepEqual(CITIES.map((c) => find(emptySave(), `city:${c}`).total), [22, 10, 9, 4]);
});

test('行った駅が増えると、路線と市の数が増える。乗り換え駅はどちらにも数える', () => {
  const d = visit(emptySave(), ['高幡不動']);
  assert.equal(find(d, 'line:keio').done, 1);
  assert.equal(find(d, 'line:keio-dobutsuen').done, 1);
  assert.equal(find(d, 'line:monorail').done, 1);
  assert.equal(find(d, 'line:chuo').done, 0);
  assert.equal(find(d, 'city:日野市').done, 1);
  assert.equal(find(d, 'city:八王子市').done, 0);
});

test('駅のカードを持っていれば、行ったことになる', () => {
  const s = stations.find((x) => x.name === '日野')!;
  const d = { ...emptySave(), collection: { [stationItemId(s.id, 'NORMAL')]: { count: 1, firstAcquiredAt: T } } };
  assert.equal(find(d, 'line:chuo').done, 1);
});

test('100%になるまではかけらを配らない', () => {
  const d = visit(emptySave(), ['高幡不動', '多摩動物公園']);
  assert.equal(find(d, 'line:keio-dobutsuen').done, 2);
  assert.equal(claimRewards(visit(emptySave(), ['高幡不動']), stations, T), null);
});

test('100%になると、駅の数 × 10 個のかけらが1回だけもらえる', () => {
  const d = visit(emptySave(), ['高幡不動', '多摩動物公園']);
  const c = claimRewards({ ...d, shards: 5 }, stations, T + 1)!;
  assert.equal(c.shards, 20);
  assert.equal(c.data.shards, 25);
  assert.equal(c.data.rewards['line:keio-dobutsuen'], T + 1);
  assert.match(c.message, /京王動物園線の駅を、全部まわった。かけら \+20/);
  assert.equal(claimRewards(c.data, stations, T + 2), null);
  assert.equal(unclaimed(progressOf(c.data, stations)).length, 0);
});

test('同時にそろうと、まとめて配って1つの知らせにする。ケーブルとリフトは別々', () => {
  const d = visit(emptySave(), ['高尾山', '清滝']);
  const c = claimRewards(d, stations, T)!;
  assert.equal(c.shards, 40);
  assert.deepEqual(Object.keys(c.data.rewards).sort(), ['line:cable', 'line:lift']);
  assert.match(c.message, /路線2つを、全部まわった。かけら \+40/);
});

test('市がそろうと市の分も配る(多摩市の4駅)', () => {
  const d = visit(emptySave(), ['永山', '唐木田', '多摩センター', '聖蹟桜ヶ丘']);
  const c = claimRewards(d, stations, T)!;
  assert.ok(c.data.rewards['city:多摩市']);
  assert.ok(c.data.rewards['line:odakyu-tama']);
  assert.equal(c.shards, 40 + 30);
  assert.match(c.message, /路線1つと市1つ/);
});

test('配るかけらの数は設定ファイルの値に合わせる', () => {
  assert.equal(CONFIG.completeShardsPerStation, 10);
});

test('もらった印は書き出しに入り、読み込んでも残る。欄が無い古い記録は空として読む', () => {
  const c = claimRewards(visit(emptySave(), ['高幡不動', '多摩動物公園']), stations, T)!;
  assert.deepEqual(parseSave(exportJson(c.data)).rewards, c.data.rewards);
  const { rewards: _drop, ...old } = c.data;
  assert.deepEqual(parseSave(JSON.stringify(old)).rewards, {});
  assert.deepEqual(parseSave(JSON.stringify({ ...old, rewards: { 'line:x': 'あ' } })).rewards, {});
});
