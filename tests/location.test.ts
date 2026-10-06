import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAdaptiveLocation, decideMode, speedKmh, type Clock, type GpsDevice, type GpsMode, type LocationError, type Reading } from '../src/location.ts';
import { north } from './helpers.ts';

const LAT = 35.6559, LON = 139.3389;
const T0 = 1_790_000_000_000;

/** 偽物の時計。advance で時間を進めると、その間に来る予約を順に実行する */
function fakeClock() {
  let now = T0;
  let nextId = 1;
  const timers = new Map<number, { at: number; fn: () => void }>();
  const clock: Clock = {
    setTimeout: (fn, ms) => { timers.set(nextId, { at: now + ms, fn }); return nextId++; },
    clearTimeout: (id) => void timers.delete(id),
  };
  return {
    clock,
    now: () => now,
    pending: () => [...timers.values()].map((t) => t.at - now),
    advance(ms: number) {
      const end = now + ms;
      for (;;) {
        const due = [...timers.entries()].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        timers.delete(due[0]);
        now = due[1].at;
        due[1].fn();
      }
      now = end;
    },
  };
}

/** 偽物のGPS。position(t) が、その時刻の位置を返す。取りに行った時刻と、測り続けている状態を記録する */
function fakeDevice(c: ReturnType<typeof fakeClock>, position: (t: number) => Omit<Reading, 't'>, error?: LocationError) {
  const gets: number[] = [];
  let watching: ((r: Reading) => void) | null = null;
  const device: GpsDevice = {
    getOnce(ok, ng) {
      gets.push(c.now());
      if (error) ng(error);
      else ok({ ...position(c.now()), t: c.now() });
    },
    watch(ok) { watching = ok; return 1; },
    clearWatch() { watching = null; },
  };
  return {
    device, gets,
    isWatching: () => watching != null,
    /** 測り続けている間、1秒ごとに位置を送る */
    tickWatch(seconds: number) {
      for (let i = 0; i < seconds; i++) {
        c.advance(1000);
        watching?.({ ...position(c.now()), t: c.now() });
      }
    },
  };
}

/** 北へ一定の速さで進む位置。speedMps は端末が教える速さ(null なら教えない) */
const moving = (mps: (t: number) => number, reportSpeed = true) => {
  let y = 0;
  let last = T0;
  return (t: number) => {
    y += mps(t) * ((t - last) / 1000);
    last = t;
    return { ...north(LAT, LON, y), accuracyM: 8, speedMps: reportSpeed ? mps(t) : null };
  };
};

function startAt(mps: (t: number) => number, reportSpeed = true) {
  const c = fakeClock();
  const d = fakeDevice(c, moving(mps, reportSpeed));
  const modes: GpsMode[] = [];
  const fixes: number[] = [];
  const loc = createAdaptiveLocation(d.device, c.clock);
  loc.start((f) => fixes.push(f.t), () => {}, (m) => modes.push(m));
  return { c, d, modes, fixes, loc };
}

const kmh = (v: number) => v / 3.6;

test('止まっている・歩いているときは15秒ごとに取りに行く', () => {
  const { c, d, modes } = startAt(() => kmh(4.5));
  c.advance(60_000);
  assert.deepEqual(d.gets.map((t) => (t - T0) / 1000), [0, 15, 30, 45, 60]);
  assert.equal(d.isWatching(), false);
  assert.deepEqual(modes, ['slow']);
});

test('時速20kmなら5秒ごとに取りに行く', () => {
  const { c, d, modes } = startAt(() => kmh(20));
  c.advance(30_000);
  assert.deepEqual(modes, ['slow', 'medium']);
  // 最初の1回で速さが分かり、そこから5秒ごと
  assert.deepEqual(d.gets.map((t) => (t - T0) / 1000), [0, 5, 10, 15, 20, 25, 30]);
});

test('時速60kmなら測り続ける。駅で一瞬止まっても戻らず、遅い状態が20秒続くと戻る', () => {
  let stopAt = Infinity;
  const { c, d, modes } = startAt((t) => (t >= stopAt ? 0 : kmh(60)));
  assert.equal(d.isWatching(), true);
  assert.deepEqual(modes, ['slow', 'continuous']);
  d.tickWatch(30);
  // 15秒止まって、また走り出す
  stopAt = c.now();
  d.tickWatch(15);
  assert.equal(d.isWatching(), true);
  stopAt = Infinity;
  d.tickWatch(10);
  // 止まったまま20秒たつと、取りに行く方式に戻る
  stopAt = c.now();
  d.tickWatch(19);
  assert.equal(d.isWatching(), true);
  d.tickWatch(2);
  assert.equal(d.isWatching(), false);
  assert.deepEqual(modes, ['slow', 'continuous', 'slow']);
  assert.deepEqual(c.pending(), [15_000]);
});

test('端末が速さを教えないときは、位置の差から速さを出す', () => {
  const { c, modes } = startAt(() => kmh(60), false);
  // 1回目は前の位置がないので分からない。15秒後の2回目で速さが分かる
  assert.deepEqual(modes, ['slow']);
  c.advance(15_000);
  assert.deepEqual(modes, ['slow', 'continuous']);
});

test('誤差より小さい動きは止まっている扱い', () => {
  const a: Reading = { ...north(LAT, LON, 0), accuracyM: 10, speedMps: null, t: T0 };
  assert.equal(speedKmh(a, { ...north(LAT, LON, 15), accuracyM: 10, speedMps: null, t: T0 + 15_000 }), 0);
  assert.ok(Math.abs(speedKmh(a, { ...north(LAT, LON, 100), accuracyM: 10, speedMps: null, t: T0 + 15_000 }) - 24) < 0.1);
  assert.equal(speedKmh(a, { ...a, speedMps: -1, t: T0 + 1000 }), 0);
});

test('速さの境目', () => {
  assert.equal(decideMode('slow', 9.9, null, T0).mode, 'slow');
  assert.equal(decideMode('slow', 10, null, T0).mode, 'medium');
  assert.equal(decideMode('medium', 40, null, T0).mode, 'continuous');
  assert.deepEqual(decideMode('continuous', 35, null, T0), { mode: 'continuous', lowSince: null });
  assert.deepEqual(decideMode('continuous', 20, null, T0), { mode: 'continuous', lowSince: T0 });
  assert.deepEqual(decideMode('continuous', 20, T0, T0 + 20_000), { mode: 'medium', lowSince: null });
});

test('位置の許可が拒否されたら、取りに行くのをやめる', () => {
  const c = fakeClock();
  const d = fakeDevice(c, () => ({ lat: LAT, lon: LON, accuracyM: 8, speedMps: 0 }), 'denied');
  const errors: LocationError[] = [];
  const loc = createAdaptiveLocation(d.device, c.clock);
  loc.start(() => {}, (e) => errors.push(e));
  c.advance(60_000);
  loc.wake();
  assert.deepEqual(errors, ['denied']);
  assert.equal(d.gets.length, 1);
});

test('取れなかったときは、次の予定でまた取りに行く', () => {
  const c = fakeClock();
  const d = fakeDevice(c, () => ({ lat: LAT, lon: LON, accuracyM: 8, speedMps: 0 }), 'unavailable');
  const loc = createAdaptiveLocation(d.device, c.clock);
  loc.start(() => {}, () => {});
  c.advance(30_000);
  assert.equal(d.gets.length, 3);
});

test('アプリが表に戻ったら、待たずに1回取りに行く', () => {
  const { c, d, loc } = startAt(() => 0);
  c.advance(5_000);
  loc.wake();
  assert.deepEqual(d.gets.map((t) => (t - T0) / 1000), [0, 5]);
  c.advance(15_000);
  assert.deepEqual(d.gets.map((t) => (t - T0) / 1000), [0, 5, 20]);
});

test('精度の悪い位置は届けるが、速さの判定には使わない', () => {
  const c = fakeClock();
  let n = 0;
  const d = fakeDevice(c, () => (++n === 2
    ? { ...north(LAT, LON, 3000), accuracyM: 500, speedMps: null }
    : { lat: LAT, lon: LON, accuracyM: 8, speedMps: null }));
  const modes: GpsMode[] = [];
  const fixes: number[] = [];
  createAdaptiveLocation(d.device, c.clock).start((f) => fixes.push(f.accuracyM ?? 0), () => {}, (m) => modes.push(m));
  c.advance(30_000);
  assert.deepEqual(fixes, [8, 500, 8]);
  assert.deepEqual(modes, ['slow']);
});
