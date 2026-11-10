import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNativeLocation, type NativeTimer, type NativeWatcher } from '../src/native-location.ts';
import type { Fix } from '../src/geofence.ts';

const T0 = 1_790_000_000_000;
const tick = () => new Promise((r) => setTimeout(r));

function setup(background = true) {
  let send: Parameters<NativeWatcher['addWatcher']>[1] = () => {};
  let options: Parameters<NativeWatcher['addWatcher']>[0] = {};
  const calls: string[] = [];
  let ids = 0;
  const plugin: NativeWatcher = {
    addWatcher: async (o, cb) => { options = o; send = cb; ids++; calls.push(`add${o.backgroundMessage ? '+閉じている間' : ''}`); return String(ids); },
    removeWatcher: async ({ id }) => { calls.push(`remove ${id}`); },
  };
  const timers = new Map<number, () => void>();
  let next = 1;
  const timer: NativeTimer = { setTimeout: (fn) => { timers.set(next, fn); return next++; }, clearTimeout: (id) => void timers.delete(id) };
  const fixes: Fix[] = [];
  const errors: string[] = [];
  const loc = createNativeLocation(plugin, timer, 30_000, 50, background, () => T0);
  loc.start((f) => fixes.push(f), (e) => errors.push(e));
  return { loc, fixes, errors, timers, calls, send: (...a: Parameters<typeof send>) => send(...a), options: () => options };
}

const at = (time: number | null) => ({ latitude: 35.6, longitude: 139.3, accuracy: 8, time });

test('閉じている間も届くよう頼み、測った時刻のまま渡す', () => {
  const s = setup();
  assert.ok(s.options().backgroundMessage);
  assert.equal(s.options().distanceFilter, 50);
  s.send(at(T0 - 3000));
  assert.deepEqual(s.fixes, [{ lat: 35.6, lon: 139.3, accuracyM: 8, t: T0 - 3000 }]);
});

test('測った時刻が無ければ今の時刻にする', () => {
  const s = setup();
  s.send(at(null));
  assert.equal(s.fixes[0].t, T0);
});

test('最初の位置が届かなければ知らせ、届いていれば知らせない', () => {
  const none = setup();
  [...none.timers.values()].forEach((fn) => fn());
  assert.deepEqual(none.errors, ['unavailable']);
  const got = setup();
  got.send(at(T0));
  assert.equal(got.timers.size, 0);
});

test('許可されていないときは denied として渡す', () => {
  const s = setup();
  s.send(undefined, { code: 'NOT_AUTHORIZED' });
  assert.deepEqual(s.errors, ['denied']);
});

test('refresh は最後の位置をもう一度渡す。まだ無ければ何もしない', () => {
  const s = setup();
  s.loc.refresh();
  assert.equal(s.fixes.length, 0);
  s.send(at(T0));
  s.loc.refresh();
  assert.equal(s.fixes.length, 2);
});

test('オフで始めると、閉じている間の合図なしで監視する', () => {
  const s = setup(false);
  assert.equal(s.options().backgroundMessage, undefined);
  assert.equal(s.options().distanceFilter, 50);
});

test('切り替えると、前の監視を止めてから新しい監視を始める', async () => {
  const s = setup();
  s.loc.setBackground!(false);
  await tick();
  assert.deepEqual(s.calls, ['add+閉じている間', 'remove 1', 'add']);
  s.loc.setBackground!(true);
  await tick();
  assert.deepEqual(s.calls.slice(3), ['remove 2', 'add+閉じている間']);
});

test('続けて切り替えても順に処理し、最後の状態になる', async () => {
  const s = setup();
  s.loc.setBackground!(false);
  s.loc.setBackground!(true);
  s.loc.setBackground!(false);
  await tick();
  assert.deepEqual(s.calls, ['add+閉じている間', 'remove 1', 'add', 'remove 2', 'add+閉じている間', 'remove 3', 'add']);
});

test('切り替えたあとも位置が届く', async () => {
  const s = setup();
  s.loc.setBackground!(false);
  await tick();
  s.send(at(T0));
  assert.equal(s.fixes.length, 1);
});
