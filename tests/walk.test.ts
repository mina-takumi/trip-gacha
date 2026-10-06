import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addFix, distanceToday, emptyWalk, localDate, type WalkState } from '../src/walk.ts';
import { M_PER_DEG_LAT, north, seededRandom } from './helpers.ts';

const LAT = 35.6559, LON = 139.3389; // 八王子駅のあたり
const T0 = new Date(2026, 9, 2, 8, 0, 0).getTime(); // 2026-10-02 08:00(端末の時刻)
const M_PER_DEG_LON = M_PER_DEG_LAT * Math.cos((LAT * Math.PI) / 180);

type F = { lat: number; lon: number; accuracyM?: number | null; t: number };
const run = (fixes: F[], start: WalkState = emptyWalk()) => fixes.reduce((s, f) => addFix(s, { accuracyM: null, ...f }), start);

/** 北へ一定の速さで進み、最後に止まる道のり。GPSの揺れ(正規分布 sigma m)を加える */
function route(metersPerSec: number, seconds: number, sigma: number, seed: number, stopSeconds = 60): F[] {
  const rand = seededRandom(seed);
  const g = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
  return Array.from({ length: seconds + stopSeconds }, (_, i) => {
    const y = Math.min(i, seconds) * metersPerSec + g() * sigma;
    return { lat: LAT + y / M_PER_DEG_LAT, lon: LON + (g() * sigma) / M_PER_DEG_LON, accuracyM: sigma ? sigma * 2 : null, t: T0 + i * 1000 };
  });
}

for (const sigma of [3, 5, 8]) {
  test(`止まっていてGPSが揺れても(σ${sigma}m)、10分で距離は増えない`, () => {
    const s = run(route(0, 600, sigma, sigma));
    assert.ok(s.dailyDistanceM < 20, `止まっているのに ${s.dailyDistanceM.toFixed(1)}m 増えた`);
  });

  test(`1km歩くと、ほぼ1km数える(揺れ σ${sigma}m)`, () => {
    const s = run(route(1.3, 770, sigma, 100 + sigma));
    assert.ok(Math.abs(s.dailyDistanceM - 1001) < 50, `${s.dailyDistanceM.toFixed(1)}m`);
  });
}

test('乗り物の速さ(時速60km)の移動も数える', () => {
  const s = run(route(16.7, 300, 5, 7));
  assert.ok(Math.abs(s.dailyDistanceM - 5010) < 150, `${s.dailyDistanceM.toFixed(1)}m`);
});

test('精度の悪い測定は使わない', () => {
  const s = run([
    { ...north(LAT, LON, 0), accuracyM: 10, t: T0 },
    { ...north(LAT, LON, 800), accuracyM: 500, t: T0 + 1000 },
    ...Array.from({ length: 60 }, (_, i) => ({ ...north(LAT, LON, 100), accuracyM: 5, t: T0 + 2000 + i * 1000 })),
  ]);
  // 起点から15m未満の残りは、次に動くまで数えない。止まるたびに最大15mほど少なく数える
  assert.ok(s.dailyDistanceM > 100 - 15 && s.dailyDistanceM <= 100, `${s.dailyDistanceM}m`);
});

test('日付が変わると0に戻る', () => {
  const day1 = run(route(1.3, 300, 0, 1));
  assert.ok(day1.dailyDistanceM > 350);
  const nextDay = T0 + 24 * 3600 * 1000;
  const day2 = addFix(day1, { ...north(LAT, LON, 600), accuracyM: null, t: nextDay });
  assert.equal(day2.dailyDistanceM, 0);
  assert.equal(day2.distanceDate, localDate(nextDay));
  // 測位がまだ来ていなくても、表示は0
  assert.equal(distanceToday(day1, nextDay), 0);
});
