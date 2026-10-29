import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyShardSpin, applySpin, applySpins, canShardSpin, cooldownRemainingMs, emptySave, exportJson, hasTicket, hasVisited, load, markVisited, parseSave, save, spinDistanceM, type StorageLike,
} from '../src/store.ts';

const memoryStorage = (): StorageLike => {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
};
const T = 1_790_000_000_000;
const MIN = 60_000;

test('初めて出たカードは記録に増え、かぶるとかけらになる', () => {
  let d = emptySave();
  let r;
  ({ data: d, result: r } = applySpin(d, 'n1', 'RARE', T));
  assert.deepEqual(r, { itemId: 'station:n1:RARE', rarity: 'RARE', isNew: true, shardsGained: 0 });
  ({ data: d, result: r } = applySpin(d, 'n1', 'RARE', T + 30 * MIN));
  assert.equal(r.isNew, false);
  assert.equal(r.shardsGained, 3);
  ({ data: d } = applySpin(d, 'n1', 'SUPER_RARE', T + 60 * MIN));
  ({ data: d, result: r } = applySpin(d, 'n1', 'SUPER_RARE', T + 90 * MIN));
  assert.equal(r.shardsGained, 10);
  assert.equal(d.shards, 13);
  assert.equal(d.totalSpins, 4);
  assert.equal(d.collection['station:n1:RARE'].count, 2);
  assert.equal(d.collection['station:n1:RARE'].firstAcquiredAt, T);
  assert.equal(d.spots.n1.spinCount, 4);
});

test('バス停で回すと共通カードが記録に入り、かぶるとかけらになる。待ち時間はバス停ごと', () => {
  let d = emptySave();
  let r;
  ({ data: d, result: r } = applySpin(d, 'b1', 'RARE', T, 'common:RARE:4'));
  assert.deepEqual(r, { itemId: 'common:RARE:4', rarity: 'RARE', isNew: true, shardsGained: 0 });
  ({ data: d, result: r } = applySpin(d, 'b2', 'RARE', T + MIN, 'common:RARE:4'));
  assert.equal(r.isNew, false);
  assert.equal(r.shardsGained, 3);
  assert.equal(d.collection['common:RARE:4'].count, 2);
  assert.equal(cooldownRemainingMs(d, 'b1', T + 10 * MIN), 10 * MIN);
  assert.equal(cooldownRemainingMs(d, 'b2', T + 10 * MIN), 11 * MIN);
});

test('同じ駅は20分回せない。時計が戻されたら回せることにする', () => {
  const { data } = applySpin(emptySave(), 'n1', 'NORMAL', T);
  assert.equal(cooldownRemainingMs(data, 'n1', T + 8 * MIN), 12 * MIN);
  assert.equal(cooldownRemainingMs(data, 'n1', T + 20 * MIN), 0);
  assert.equal(cooldownRemainingMs(data, 'n2', T), 0);
  assert.equal(cooldownRemainingMs(data, 'n1', T - 5 * MIN), 0);
});

test('書き出して、端末の記録を消して、読み込むと元に戻る', () => {
  const storage = memoryStorage();
  let { data } = applySpin(emptySave(), 'n1', 'NORMAL', T);
  ({ data } = applySpin(data, 'n2', 'SUPER_RARE', T + MIN));
  const p = { lat: 35.6, lon: 139.3, accM: 8 };
  data = { ...data, walk: { dailyDistanceM: 2800, distanceDate: '2026-10-02', smooth: p, anchor: { ...p, lat: 35.61 }, lastFixAt: T + MIN } };
  data = markVisited(data, ['n1', 'n3'], T + 2 * MIN, 2800);
  save(storage, data);
  const file = exportJson(load(storage));
  storage.removeItem('trip-gacha:save');
  assert.deepEqual(load(storage), emptySave());
  save(storage, parseSave(file));
  assert.deepEqual(load(storage), data);
});

test('壊れたファイルは理由つきで断る', () => {
  const good = JSON.parse(exportJson(emptySave()));
  assert.throws(() => parseSave('{ broken'), /JSON/);
  assert.throws(() => parseSave('[]'), /形/);
  assert.throws(() => parseSave(JSON.stringify({ ...good, schemaVersion: 99 })), /版/);
  assert.throws(() => parseSave(JSON.stringify({ ...good, collection: { x: { count: 0, firstAcquiredAt: 1 } } })), /カード/);
  assert.throws(() => parseSave(JSON.stringify({ ...good, shards: -1 })), /かけら/);
});

test('端末の記録が壊れていても、空の記録で起動する', () => {
  const storage = memoryStorage();
  storage.setItem('trip-gacha:save', 'not json');
  assert.deepEqual(load(storage), emptySave());
});

// 回す権利: 範囲内にいたら、その日のうちは範囲の外でも回せる。回したら、待ち時間が終わった後にまた範囲内にいるまで回せない
const DAY = new Date(2026, 9, 6, 9, 0, 0).getTime(); // 2026-10-06 09:00(端末の時刻)

test('範囲に入って出た後でも、権利があって回せる', () => {
  const d = markVisited(emptySave(), ['n1'], DAY, 0);
  assert.equal(hasTicket(d, 'n1', DAY + 30 * MIN), true);
  assert.equal(hasTicket(d, 'n2', DAY + 30 * MIN), false);
  assert.equal(markVisited(d, [], DAY + MIN, 0), d);
});

test('回した直後に範囲内にいても、離れたら20分たっても回せない', () => {
  let d = markVisited(emptySave(), ['n1'], DAY, 0);
  ({ data: d } = applySpin(d, 'n1', 'NORMAL', DAY + 10 * MIN));
  d = markVisited(d, ['n1'], DAY + 10 * MIN + 15_000, 0); // 回した直後の測位はまだ範囲内
  assert.equal(hasTicket(d, 'n1', DAY + 11 * MIN), false);
  assert.equal(hasTicket(d, 'n1', DAY + 31 * MIN), false); // その後は範囲の外
});

test('待ち時間の間に範囲内にいても権利は戻らず、待ち時間が終わった後に範囲内にいると戻る', () => {
  let d = markVisited(emptySave(), ['n1'], DAY, 0);
  ({ data: d } = applySpin(d, 'n1', 'NORMAL', DAY + 10 * MIN));
  d = markVisited(d, ['n1'], DAY + 29 * MIN, 0);
  assert.equal(hasTicket(d, 'n1', DAY + 40 * MIN), false);
  d = markVisited(d, ['n1'], DAY + 30 * MIN, 0);
  assert.equal(hasTicket(d, 'n1', DAY + 40 * MIN), true);
  assert.equal(cooldownRemainingMs(d, 'n1', DAY + 40 * MIN), 0);
});

test('日付が変わると権利が消える', () => {
  const d = markVisited(emptySave(), ['n1'], new Date(2026, 9, 6, 23, 50).getTime(), 0);
  assert.equal(hasTicket(d, 'n1', new Date(2026, 9, 6, 23, 59).getTime()), true);
  assert.equal(hasTicket(d, 'n1', new Date(2026, 9, 7, 0, 1).getTime()), false);
});

test('端末の時計が戻されても、権利があれば回せる', () => {
  let d = markVisited(emptySave(), ['n1'], DAY, 0);
  ({ data: d } = applySpin(d, 'n1', 'NORMAL', DAY + 60 * MIN));
  d = markVisited(d, ['n1'], DAY + 5 * MIN, 0); // 時計が55分戻った
  assert.equal(hasTicket(d, 'n1', DAY + 6 * MIN), true);
  assert.equal(cooldownRemainingMs(d, 'n1', DAY + 6 * MIN), 0);
});

test('寄った記録の無い古い書き出しファイル(0.1.1まで)も読み込める', () => {
  const old = JSON.parse(exportJson(applySpin(emptySave(), 'n1', 'NORMAL', T).data));
  delete old.visitedAt;
  const d = parseSave(JSON.stringify(old));
  assert.deepEqual(d.visitedAt, {});
  assert.equal(d.spots.n1.spinCount, 1);
  assert.throws(() => parseSave(JSON.stringify({ ...old, visitedAt: { n1: 'x' } })), /寄った/);
});

test('範囲の外で回すときは、その範囲を出たときの移動距離で確率を決める', () => {
  const DAY = new Date(2026, 9, 23, 9, 0).getTime();
  let d = markVisited(emptySave(), ['n1'], DAY, 1200);
  d = markVisited(d, ['n1'], DAY + MIN, 1500); // 範囲内にいる間は、歩けば上がる
  // 範囲を出たあとに 4km 歩いても、n1 は出たときの 1500m のまま
  assert.equal(spinDistanceM(d, 'n1', false, 5500, DAY + 30 * MIN), 1500);
  // いま範囲内なら今の距離
  assert.equal(spinDistanceM(d, 'n1', true, 5500, DAY + 30 * MIN), 5500);
  // 寄った記録の無い場所、日付が変わった後は今の距離
  assert.equal(spinDistanceM(d, 'n2', false, 5500, DAY + 30 * MIN), 5500);
  assert.equal(spinDistanceM(d, 'n1', false, 300, DAY + 24 * 60 * MIN), 300);
});

test('距離の記録が無い古い記録(0.1.9 まで)も読める。壊れた距離は断る', () => {
  const old = JSON.parse(exportJson(markVisited(emptySave(), ['n1'], T, 800)));
  delete old.visitedDistanceM;
  const d = parseSave(JSON.stringify(old));
  assert.deepEqual(d.visitedDistanceM, {});
  assert.equal(spinDistanceM(d, 'n1', false, 2000, T + MIN), 2000);
  assert.throws(() => parseSave(JSON.stringify({ ...old, visitedDistanceM: { n1: -5 } })), /移動距離/);
});

test('最後の測位の時刻が無い古い記録(0.4.0 まで)も読める', () => {
  const old = JSON.parse(exportJson({ ...emptySave(), walk: { dailyDistanceM: 1200, distanceDate: '2026-10-27', smooth: null, anchor: null, lastFixAt: T } }));
  assert.equal(parseSave(JSON.stringify(old)).walk.lastFixAt, T);
  delete old.walk.lastFixAt;
  const d = parseSave(JSON.stringify(old));
  assert.equal(d.walk.lastFixAt, null);
  assert.equal(d.walk.dailyDistanceM, 1200);
});

test('バス停をまとめて回すと、1か所ずつ回したのと同じ記録になる。同じ回で同じカードが出たら2枚目はかぶり', () => {
  const spins = [
    { spotId: 'b1', rarity: 'NORMAL' as const, itemId: 'common:NORMAL:3' },
    { spotId: 'b2', rarity: 'RARE' as const, itemId: 'common:RARE:0' },
    { spotId: 'b3', rarity: 'NORMAL' as const, itemId: 'common:NORMAL:3' },
  ];
  const { data, results } = applySpins(emptySave(), spins.map((s) => s.spotId), T, (_, id) => spins.find((s) => s.spotId === id)!);
  assert.deepEqual(results.map((r) => [r.spotId, r.isNew, r.shardsGained]), [['b1', true, 0], ['b2', true, 0], ['b3', false, 1]]);
  assert.equal(data.collection['common:NORMAL:3'].count, 2);
  assert.equal(data.shards, 1);
  assert.equal(data.totalSpins, 3);
  for (const id of ['b1', 'b2', 'b3']) assert.equal(cooldownRemainingMs(data, id, T + 5 * MIN), 15 * MIN);
  let one = emptySave();
  for (const s of spins) one = applySpin(one, s.spotId, s.rarity, T, s.itemId).data;
  assert.deepEqual(data, one);
});

test('裏カード: 初めてならかけらは0に、かぶりなら半分(切り捨て)に。かけらは増えない', () => {
  let d = { ...emptySave(), shards: 135 };
  let r;
  ({ data: d, result: r } = applySpin(d, 'b1', 'SECRET', T, 'secret:seal'));
  assert.deepEqual(r, { itemId: 'secret:seal', rarity: 'SECRET', isNew: true, shardsGained: -135 });
  assert.equal(d.shards, 0);
  d = { ...d, shards: 135 };
  ({ data: d, result: r } = applySpin(d, 'b1', 'SECRET', T + 30 * MIN, 'secret:seal'));
  assert.equal(r.isNew, false);
  assert.equal(d.shards, 67);
  assert.equal(r.shardsGained, -68);
  assert.equal(d.collection['secret:seal'].count, 2);
  // かけらが無くても減らない
  ({ data: d } = applySpin({ ...d, shards: 0 }, 'b1', 'SECRET', T + 60 * MIN, 'secret:seal'));
  assert.equal(d.shards, 0);
});

test('まとめて回すとき、前の場所で増減したかけらを見てから次を引く', () => {
  const seen: number[] = [];
  const draws: Record<string, { rarity: 'NORMAL' | 'SECRET'; itemId: string }> = {
    b1: { rarity: 'NORMAL', itemId: 'common:NORMAL:3' },
    b2: { rarity: 'SECRET', itemId: 'secret:lighthouse' },
    b3: { rarity: 'NORMAL', itemId: 'common:NORMAL:3' },
  };
  const start = { ...emptySave(), shards: 40, collection: { 'common:NORMAL:3': { count: 1, firstAcquiredAt: T } } };
  const { data } = applySpins(start, ['b1', 'b2', 'b3'], T, (d, id) => { seen.push(d.shards); return { spotId: id, ...draws[id] }; });
  // b1 のかぶりで41、b2 の裏カード(初めて)で0、b3 のかぶりで1
  assert.deepEqual(seen, [40, 41, 0]);
  assert.equal(data.shards, 1);
});

test('行ったことのある駅: 範囲に入った記録があるか、その駅のカードを持っている', () => {
  let d = emptySave();
  assert.equal(hasVisited(d, 'n1'), false);
  assert.equal(hasVisited(markVisited(d, ['n1'], T, 0), 'n1'), true);
  ({ data: d } = applySpin(d, 'n2', 'NORMAL', T));
  assert.equal(hasVisited(d, 'n2'), true);
  assert.equal(hasVisited(d, 'n1'), false);
});

test('かけらで回す: 300個使い、カードは記録し、待ち時間と回す権利は変えない', () => {
  let d = markVisited({ ...emptySave(), shards: 350 }, ['n1'], T, 0);
  ({ data: d } = applySpin(d, 'n1', 'NORMAL', T + MIN));
  assert.equal(canShardSpin(d, 'n1'), true);
  const r = applyShardSpin(d, 'n1', 'RARE', T + 2 * MIN)!;
  assert.equal(r.result.isNew, true);
  assert.equal(r.data.shards, 50);
  assert.equal(r.data.collection['station:n1:RARE'].count, 1);
  assert.equal(r.data.totalSpins, d.totalSpins + 1);
  assert.deepEqual(r.data.spots, d.spots);
  assert.equal(cooldownRemainingMs(r.data, 'n1', T + 2 * MIN), cooldownRemainingMs(d, 'n1', T + 2 * MIN));
  // かぶれば、いつもどおりかけらが増える
  const dup = applyShardSpin({ ...d, shards: 300 }, 'n1', 'NORMAL', T + 3 * MIN)!;
  assert.equal(dup.result.shardsGained, 1);
  assert.equal(dup.data.shards, 1);
  // 待ち時間の後に範囲内にいて戻った権利も、かけらで回したあとに残る
  const later = markVisited(d, ['n1'], T + 30 * MIN, 0);
  assert.equal(hasTicket(applyShardSpin(later, 'n1', 'NORMAL', T + 31 * MIN)!.data, 'n1', T + 31 * MIN), true);
});

test('かけらが足りないとき、行ったことのない駅では回せず、記録も変えない', () => {
  const d = markVisited({ ...emptySave(), shards: 299 }, ['n1'], T, 0);
  assert.equal(canShardSpin(d, 'n1'), false);
  assert.equal(applyShardSpin(d, 'n1', 'NORMAL', T), null);
  const rich = { ...emptySave(), shards: 1000 };
  assert.equal(canShardSpin(rich, 'n1'), false);
  assert.equal(applyShardSpin(rich, 'n1', 'NORMAL', T), null);
});
