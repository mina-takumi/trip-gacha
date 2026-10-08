import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../src/config.ts';
import { drawRarity, metersToNextStep, oddsFor } from '../src/gacha.ts';
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
