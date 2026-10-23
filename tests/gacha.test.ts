import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../src/config.ts';
import { readFileSync } from 'node:fs';
import { drawRarity, metersToNextStep, oddsFor, pickCommon, secretChance } from '../src/gacha.ts';
import { createCatalog, SPECIAL_NOUNS, type Rarity, type Spot } from '../src/items.ts';
import { seededRandom } from './helpers.ts';

const base = CONFIG.stationOddsBp;

test('移動距離で確率が上がる: 1kmごとに1%、15kmで+15%まで', () => {
  assert.deepEqual(oddsFor(base, 0), { NORMAL: 6000, RARE: 3000, SUPER_RARE: 1000 });
  assert.deepEqual(oddsFor(base, 999), { NORMAL: 6000, RARE: 3000, SUPER_RARE: 1000 });
  assert.deepEqual(oddsFor(base, 1000), { NORMAL: 5900, RARE: 3000, SUPER_RARE: 1100 });
  assert.deepEqual(oddsFor(base, 5000), { NORMAL: 5500, RARE: 3000, SUPER_RARE: 1500 });
  assert.deepEqual(oddsFor(base, 14999), { NORMAL: 4600, RARE: 3000, SUPER_RARE: 2400 });
  assert.deepEqual(oddsFor(base, 15000), { NORMAL: 4500, RARE: 3000, SUPER_RARE: 2500 });
  assert.deepEqual(oddsFor(base, 30000), { NORMAL: 4500, RARE: 3000, SUPER_RARE: 2500 });
});

test('次の段階までの距離', () => {
  assert.equal(metersToNextStep(0), 1000);
  assert.equal(metersToNextStep(2800), 200);
  assert.equal(metersToNextStep(14999), 1);
  assert.equal(metersToNextStep(15000), null);
});

for (const [distanceM, expected] of [[0, [0.6, 0.3, 0.1]], [15000, [0.45, 0.3, 0.25]]] as const) {
  test(`10万回の抽選で設計どおりの割合になる(移動 ${distanceM}m)`, () => {
    const rand = seededRandom(20261002 + distanceM);
    const odds = oddsFor(base, distanceM);
    const count = { NORMAL: 0, RARE: 0, SUPER_RARE: 0 };
    const N = 100_000;
    for (let i = 0; i < N; i++) count[drawRarity(odds, rand)]++;
    const got = [count.NORMAL / N, count.RARE / N, count.SUPER_RARE / N];
    got.forEach((p, i) => assert.ok(Math.abs(p - expected[i]) < 0.005, `割合 ${got.map((x) => x.toFixed(4))} / 期待 ${expected}`));
  });
}

test('抽選の境目', () => {
  const odds = oddsFor(base, 0);
  assert.equal(drawRarity(odds, () => 0), 'NORMAL');
  assert.equal(drawRarity(odds, () => 0.5999), 'NORMAL');
  assert.equal(drawRarity(odds, () => 0.6), 'RARE');
  assert.equal(drawRarity(odds, () => 0.8999), 'RARE');
  assert.equal(drawRarity(odds, () => 0.9), 'SUPER_RARE');
  assert.equal(drawRarity(odds, () => 0.99999), 'SUPER_RARE');
});

test('バス停の確率は 70/25/5 で、移動距離で同じように上がる', () => {
  assert.deepEqual(oddsFor(CONFIG.busOddsBp, 0), { NORMAL: 7000, RARE: 2500, SUPER_RARE: 500 });
  assert.deepEqual(oddsFor(CONFIG.busOddsBp, 15000), { NORMAL: 5500, RARE: 2500, SUPER_RARE: 2000 });
});

test('裏カードの確率: 0.01% + かけら1個につき0.0001%、0.2%で頭打ち', () => {
  assert.equal(secretChance(0), 0.0001);
  assert.equal(secretChance(100), 0.0002);
  assert.equal(secretChance(1899), 0.001999);
  assert.equal(secretChance(1900), 0.002);
  assert.equal(secretChance(50000), 0.002);
  assert.equal(secretChance(-5), 0.0001);
});

for (const [shards, expected] of [[0, 100], [1900, 2000]] as const) {
  test(`100万回引くと、裏カードは設計どおりの回数出る(かけら ${shards})`, () => {
    const rand = seededRandom(20261023 + shards);
    const p = secretChance(shards);
    let n = 0;
    for (let i = 0; i < 1_000_000; i++) if (rand() < p) n++;
    // 回数のばらつき(標準偏差)の4倍まで許す
    assert.ok(Math.abs(n - expected) < 4 * Math.sqrt(expected), `${n}回(期待 約${expected}回)`);
  });
}

test('裏カード: 名前は物の名前だけ(バス停の名前は入れない)。絵は駅カードとは別の裏カード用', () => {
  const spot = { id: 'n1', name: '中野', kind: 'bus_stop', lat: 0, lon: 0 };
  const catalog = createCatalog([spot]);
  const card = catalog.describe(catalog.secretAt('n1'))!;
  assert.equal(card.rarity, 'SECRET');
  assert.equal(card.name, card.noun);
  assert.ok(SPECIAL_NOUNS.includes(card.name));
  assert.match(card.art, /^secret\//);
  assert.equal(catalog.describe('secret:n1'), null);
});

test('裏カードは物ごとに24種。バス停ごとに出る物は決まっていて、24種ともどこかのバス停で出る', () => {
  const { spots } = JSON.parse(readFileSync(new URL('../data/spots.json', import.meta.url), 'utf8'));
  const catalog = createCatalog(spots);
  const bus: Spot[] = spots.filter((s: Spot) => s.kind === 'bus_stop');
  assert.equal(new Set(bus.map((s) => catalog.secretAt(s.id))).size, SPECIAL_NOUNS.length);
  // 同じ記録から作り直しても、同じバス停では同じ物
  const again = createCatalog(spots);
  for (const s of bus) assert.equal(again.secretAt(s.id), catalog.secretAt(s.id));
});

test('バス停では、出たレア度の共通カード(ノーマル70・レア35・スーパーレア15枚)がまんべんなく出る', () => {
  const { common } = createCatalog([]);
  const rand = seededRandom(20261022);
  for (const [rarity, kinds] of [['NORMAL', 70], ['RARE', 35], ['SUPER_RARE', 15]] as [Rarity, number][]) {
    const N = kinds * 1000;
    const count = new Map<string, number>();
    for (let i = 0; i < N; i++) {
      const card = pickCommon(common, rarity, rand);
      assert.equal(card.rarity, rarity);
      count.set(card.itemId, (count.get(card.itemId) ?? 0) + 1);
    }
    assert.equal(count.size, kinds);
    for (const n of count.values()) assert.ok(n > 850 && n < 1150, `${rarity}: 1種あたり ${n}回(期待 約1000回)`);
  }
  assert.equal(pickCommon(common, 'RARE', () => 0.99999999).rarity, 'RARE');
});
