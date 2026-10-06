import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applySpin, cooldownRemainingMs, emptySave, exportJson, load, parseSave, save, type StorageLike } from '../src/store.ts';

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
  data = { ...data, walk: { dailyDistanceM: 2800, distanceDate: '2026-10-02', smooth: p, anchor: { ...p, lat: 35.61 } } };
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
