import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyBusPassSpin, applyPassCount, applyPassRoute, busPassToday, emptySave, exportJson, hasTicket, isPassSegment, markVisited, parseSave, spinDistanceM, type PassSegment,
} from '../src/store.ts';
import { localDate } from '../src/walk.ts';
import { north } from './helpers.ts';

const T0 = new Date(2026, 9, 30, 8, 0, 0).getTime(); // 2026-10-30 08:00(端末の時刻)
const MIN = 60_000;
const LAT = 35.6559, LON = 139.3389;
const last = { lat: LAT, lon: LON, t: T0, distanceM: 1200 };

test('2分以上たち、300m以上離れて開き直したときだけ、閉じている間の区間にする', () => {
  assert.equal(isPassSegment(last, { ...north(LAT, LON, 1000), t: T0 + 10 * MIN }), true);
  assert.equal(isPassSegment(last, { ...north(LAT, LON, 1000), t: T0 + 1 * MIN }), false); // 開いたまま
  assert.equal(isPassSegment(last, { ...north(LAT, LON, 200), t: T0 + 10 * MIN }), false); // ほとんど動いていない
  assert.equal(isPassSegment(last, { ...north(LAT, LON, 1000), t: T0 + 24 * 60 * MIN }), false); // 日付が変わった
  assert.equal(isPassSegment(null, { ...north(LAT, LON, 1000), t: T0 + 10 * MIN }), false); // 初めて
});

const seg: PassSegment = { from: last, to: { ...north(LAT, LON, 2000), t: T0 + 20 * MIN }, addedM: 1900 };

test('通過した場所に回す権利が付く。時刻と移動距離は道のりの割合で決める', () => {
  let data = emptySave();
  data = { ...data, walk: { ...data.walk, dailyDistanceM: 3100, distanceDate: localDate(T0) } };
  const r = applyPassRoute(data, seg, 2500, [{ spotId: 'a', alongM: 500 }, { spotId: 'b', alongM: 2500 }]);
  assert.equal(r.visitedAt.a, T0 + 4 * MIN); // 2500m のうち 500m → 20分の 1/5
  assert.equal(r.visitedDistanceM.a, 1200 + 500); // 区間を始めたときの距離 + そこまでの道のり
  assert.equal(r.passedAt.b, T0 + 20 * MIN);
  assert.ok(hasTicket(r, 'a', T0 + 30 * MIN));
  // 範囲の外で回すときの確率は、通過したときの距離で決まる
  assert.equal(spinDistanceM(r, 'a', false, 5000, T0 + 30 * MIN), 1700);
  // 推測した道のり 2500m のうち、もう足してある 1900m を除いた 600m を足す
  assert.equal(r.walk.dailyDistanceM, 3100 + 600);
});

test('今日もっと後に範囲内にいた記録があれば、通過では上書きしない', () => {
  const data = markVisited(emptySave(), ['a'], T0 + 30 * MIN, 9000);
  const r = applyPassRoute(data, seg, 2500, [{ spotId: 'a', alongM: 500 }]);
  assert.equal(r.visitedAt.a, T0 + 30 * MIN);
  assert.equal(r.visitedDistanceM.a, 9000);
  assert.equal(r.passedAt.a, undefined);
});

test('道すじが出ないときのバス停の回数は、その日のうちだけ。回すと減り、場所ごとの待ち時間は変えない', () => {
  let data = applyPassCount(emptySave(), T0, 4);
  data = applyPassCount(data, T0 + 30 * MIN, 3);
  assert.equal(busPassToday(data, T0 + 60 * MIN), 7);
  assert.equal(busPassToday(data, T0 + 24 * 60 * MIN), 0);
  const r = applyBusPassSpin(data, 'NORMAL', 'common:NORMAL:0', T0 + 60 * MIN)!;
  assert.equal(busPassToday(r.data, T0 + 60 * MIN), 6);
  assert.deepEqual(r.data.spots, {});
  assert.equal(r.data.totalSpins, 1);
  assert.ok(r.data.collection['common:NORMAL:0']);
  // 翌日は回せない
  assert.equal(applyBusPassSpin(data, 'NORMAL', 'common:NORMAL:0', T0 + 24 * 60 * MIN), null);
});

test('通過の記録も書き出して読み込める。0.6.0 までの記録(項目が無い)も読める', () => {
  let data = applyPassRoute(emptySave(), seg, 2500, [{ spotId: 'a', alongM: 500 }]);
  data = { ...applyPassCount(data, T0, 2), lastFix: last, pending: [seg] };
  assert.deepEqual(parseSave(exportJson(data)), data);
  const old = JSON.parse(exportJson(emptySave()));
  for (const k of ['lastFix', 'passedAt', 'busPass', 'pending']) delete old[k];
  assert.deepEqual(parseSave(JSON.stringify(old)), emptySave());
  // 形の違う項目は空として読む(記録全体は断らない)
  const bad = parseSave(JSON.stringify({ ...old, lastFix: { lat: 'x' }, pending: [{ from: 1 }], busPass: { date: 3 } }));
  assert.equal(bad.lastFix, null);
  assert.deepEqual(bad.pending, []);
  assert.deepEqual(bad.busPass, { date: '', count: 0 });
});
