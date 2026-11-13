import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setBatch, applyFriendSpin, canFriendSpin, decodeQr, encodeQr, friendCandidates, friendStations, spunByMe, weekStart } from '../src/friend.ts';
import { stationItemId } from '../src/gacha.ts';
import { createCatalog, type Spot } from '../src/items.ts';
import { claimRewards, progressOf } from '../src/progress.ts';
import { applySpin, emptySave, exportJson, hasVisited, markVisited, parseSave, type SaveData } from '../src/store.ts';
import { CONFIG } from '../src/config.ts';

const { spots } = JSON.parse(readFileSync(new URL('../data/spots.json', import.meta.url), 'utf8')) as { spots: Spot[] };
const stations = spots.filter((s) => s.kind === 'station');
const order = Object.keys(createCatalog(spots).stations);
const idOf = (name: string) => stations.find((s) => s.name === name)!.id;
const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime();
const T = at(2026, 11, 13);

/** 実際に行って回した記録を付ける */
const spun = (data: SaveData, names: string[]) => names.reduce((d, n) => applySpin(d, idOf(n), 'NORMAL', T).data, data);

test('QRに入れる駅の並びは45駅で、毎回同じ(先頭・境目・最後を固定する)', () => {
  const name = (id: string) => stations.find((s) => s.id === id)!.name;
  assert.equal(order.length, 45);
  assert.deepEqual([order[0], order[21], order[22], order[44]].map(name), ['八王子みなみ野', '京王堀之内', '高幡不動', '聖蹟桜ヶ丘']);
});

test('自分のQRを作って読み解くと、回した駅だけが1になる', () => {
  const d = spun(emptySave(), ['八王子', '高幡不動']);
  const text = encodeQr(order, d);
  assert.match(text, /^TG1\.45\.[0-9a-f]{12}$/);
  const bits = decodeQr(text)!;
  assert.equal(bits.length, 45);
  assert.deepEqual(order.filter((_, i) => bits[i]), [idOf('八王子'), idOf('高幡不動')].sort((a, b) => order.indexOf(a) - order.indexOf(b)));
});

test('QRには名前・日時・カードは入らない(目印と駅の0/1だけ)', () => {
  const text = encodeQr(order, spun(emptySave(), ['八王子']));
  assert.ok(text.length < 24);
  assert.match(text, /^TG1\.45\.[0-9a-f]{12}$/);
  assert.doesNotMatch(text, /八王子|station|common/);
});

test('トリップガチャのQRでないものは読み解けない', () => {
  for (const bad of ['', 'https://example.com', 'TG1.45.zz', 'TG1.45.123', 'TG2.45.000000000000', 'TG1.0.', 'TG1.45.00000000000g']) {
    assert.equal(decodeQr(bad), null, bad);
  }
});

test('友達のQRから、自分がカードを持っていない駅だけが候補になる', () => {
  const friend = spun(emptySave(), ['八王子', '高幡不動', '南大沢']);
  const me = spun(emptySave(), ['八王子']);
  const ids = friendStations(order, decodeQr(encodeQr(order, friend))!, me);
  assert.deepEqual(ids.sort(), [idOf('高幡不動'), idOf('南大沢')].sort());
});

test('駅の数が自分と友達で違っても、共通の先頭の分で読める', () => {
  const bits = decodeQr(encodeQr(order.slice(0, 30), spun(emptySave(), ['八王子みなみ野', '聖蹟桜ヶ丘'])))!;
  assert.equal(bits.length, 30);
  assert.deepEqual(friendStations(order, bits, emptySave()), [idOf('八王子みなみ野')]);
  assert.deepEqual(friendStations(order.slice(0, 30), decodeQr(encodeQr(order, spun(emptySave(), ['聖蹟桜ヶ丘'])))!, emptySave()), []);
});

test('候補にする: 読んだ1人分だけ。別のQRを読むと入れ替わり、混ざらない', () => {
  const a = idOf('高幡不動'), b = idOf('南大沢'), c = idOf('日野');
  const r1 = setBatch(emptySave(), [a, b]);
  assert.equal(r1.added, 2);
  assert.equal(r1.replaced, false);
  const r2 = setBatch(r1.data, [a, c]);
  assert.deepEqual(r2.data.friendQueue, [a, c]);
  assert.equal(r2.added, 2);
  assert.equal(r2.replaced, true);
});

test('候補にする: 同じQRをまた読んでも変わらない。新しい駅が無いQRは前の候補を消さない', () => {
  const a = idOf('高幡不動'), b = idOf('南大沢');
  const r1 = setBatch(emptySave(), [a, b]);
  const same = setBatch(r1.data, [b, a]);
  assert.equal(same.added, 0);
  assert.equal(same.data, r1.data);
  const empty = setBatch(r1.data, []);
  assert.equal(empty.added, 0);
  assert.deepEqual(empty.data.friendQueue, [a, b]);
});

test('候補にする: 前の候補のうち自分で手に入れた駅は数えず、同じ中身なら変わらない', () => {
  const a = idOf('高幡不動'), b = idOf('南大沢');
  const owned = spun(setBatch(emptySave(), [a, b]).data, ['高幡不動']);
  assert.equal(setBatch(owned, [b]).added, 0);
});

test('友達の駅で手に入れただけの駅は、自分のQRに入らない', () => {
  const d0 = setBatch(emptySave(), [idOf('高幡不動')]).data;
  const r = applyFriendSpin(d0, T, () => 'NORMAL')!;
  assert.equal(spunByMe(r.data, idOf('高幡不動')), false);
  assert.ok(decodeQr(encodeQr(order, r.data))!.every((b) => !b));
});

test('週は月曜0時で切り替わる', () => {
  assert.equal(weekStart(at(2026, 11, 9, 0)), '2026-11-09');
  assert.equal(weekStart(at(2026, 11, 15, 23)), '2026-11-09');
  assert.equal(weekStart(at(2026, 11, 16, 0)), '2026-11-16');
  assert.equal(weekStart(at(2026, 11, 13)), '2026-11-09');
});

test('回す: 候補からランダムに1駅だけ。残りの候補は消え、今週は回せなくなる', () => {
  const ids = [idOf('高幡不動'), idOf('南大沢'), idOf('日野')];
  const d0 = setBatch(emptySave(), ids).data;
  assert.equal(canFriendSpin(d0, T), true);
  const r = applyFriendSpin(d0, T, () => 'RARE', () => 1)!;
  assert.equal(r.result.spotId, ids[1]);
  assert.ok(r.result.isNew && r.result.rarity === 'RARE' && r.result.shardsGained === 0);
  assert.ok(r.data.collection[stationItemId(ids[1], 'RARE')]);
  assert.equal(Object.keys(r.data.collection).length, 1);
  assert.deepEqual(Object.keys(r.data.friendCards), [ids[1]]);
  assert.deepEqual(r.data.friendQueue, []);
  assert.equal(r.data.friendWeek, '2026-11-09');
  assert.equal(r.data.totalSpins, 1);
  assert.equal(applyFriendSpin(d0, T, () => 'RARE', () => 99)!.result.spotId, ids[2]);
  assert.equal(applyFriendSpin(d0, T, () => 'RARE', () => -5)!.result.spotId, ids[0]);
  assert.equal(canFriendSpin(setBatch(r.data, [idOf('町田')]).data, at(2026, 11, 15, 20)), false);
  assert.equal(canFriendSpin(setBatch(r.data, [idOf('町田')]).data, at(2026, 11, 16, 0)), true);
});

test('友達の駅を回しても、待ち時間・回す権利・日記は変わらない', () => {
  const d0 = setBatch(emptySave(), [idOf('高幡不動')]).data;
  const r = applyFriendSpin(d0, T, () => 'NORMAL')!;
  assert.deepEqual(r.data.spots, {});
  assert.deepEqual(r.data.visitedAt, {});
  assert.deepEqual(r.data.diary, []);
});

test('候補が空・今週もう回した・読んだあとに自分で手に入れた駅だけのときは回せない', () => {
  assert.equal(applyFriendSpin(emptySave(), T, () => 'NORMAL'), null);
  const id = idOf('高幡不動');
  const done = applyFriendSpin(setBatch(emptySave(), [id]).data, T, () => 'NORMAL')!.data;
  assert.equal(applyFriendSpin(setBatch(done, [idOf('南大沢')]).data, T + 1000, () => 'NORMAL'), null);
  const mine = spun(setBatch(emptySave(), [id]).data, ['高幡不動']);
  assert.deepEqual(friendCandidates(mine), []);
  assert.equal(canFriendSpin(mine, T), false);
});

test('友達の駅で手に入れたカードは「行った駅」に数えない。本当に行くと数える', () => {
  const id = idOf('高幡不動');
  let d = applyFriendSpin(setBatch(emptySave(), [id]).data, T, () => 'NORMAL')!.data;
  assert.equal(hasVisited(d, id), false);
  const p = progressOf(d, stations);
  assert.equal(p.find((x) => x.key === 'line:keio-dobutsuen')!.done, 0);
  assert.equal(p.find((x) => x.key === 'city:日野市')!.done, 0);
  assert.equal(p.find((x) => x.key === 'line:keio')!.members.find((m) => m.id === id)!.state, 'friend');
  d = markVisited(d, [id], T + 1000, 0);
  assert.equal(hasVisited(d, id), true);
  assert.equal(progressOf(d, stations).find((x) => x.key === 'line:keio')!.members.find((m) => m.id === id)!.state, 'visited');
});

test('友達の駅だけで路線を埋めても、かけらは配られない', () => {
  const ids = ['高幡不動', '多摩動物公園'].map(idOf);
  let d = setBatch(emptySave(), ids).data;
  d = applyFriendSpin(d, T, () => 'NORMAL', () => 0)!.data;
  d = applyFriendSpin(setBatch(d, [ids[1]]).data, T + 8 * 86400000, () => 'NORMAL', () => 0)!.data;
  assert.equal(Object.keys(d.friendCards).length, 2);
  assert.equal(claimRewards(d, stations, T), null);
  assert.equal(d.shards, 0);
  assert.equal(CONFIG.completeShardsPerStation, 10);
});

test('候補・週・友達の駅は書き出しに入り、読み込んでも残る。古い記録は空として読む', () => {
  const d = applyFriendSpin(setBatch(emptySave(), [idOf('高幡不動')]).data, T, () => 'NORMAL')!.data;
  const withQueue = setBatch(d, [idOf('南大沢')]).data;
  const back = parseSave(exportJson(withQueue));
  assert.deepEqual(back.friendQueue, [idOf('南大沢')]);
  assert.equal(back.friendWeek, '2026-11-09');
  assert.deepEqual(back.friendCards, d.friendCards);
  const { friendQueue: _q, friendWeek: _w, friendCards: _c, ...old } = withQueue;
  const o = parseSave(JSON.stringify(old));
  assert.deepEqual([o.friendQueue, o.friendWeek, o.friendCards], [[], '', {}]);
  assert.deepEqual(parseSave(JSON.stringify({ ...old, friendQueue: [1], friendWeek: 3, friendCards: { a: 'x' } })).friendQueue, []);
});
