import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGeofence } from '../src/geofence.ts';
import { north } from './helpers.ts';

const station = { id: 'n1', name: '八王子', kind: 'station', lat: 35.6559, lon: 139.3389 };
const params = { enterRadiusM: 200, exitRadiusM: 250, accuracyLimitM: 100 };
const at = (m: number, accuracyM: number | null = 10, t = 0) => ({ ...north(station.lat, station.lon, m), accuracyM, t });

test('200m以内で入り、250mを超えるまで出ない', () => {
  const g = createGeofence([station], params);
  assert.equal(g.update(at(201)).events.length, 0);
  assert.equal(g.update(at(199)).events[0]?.type, 'enter');
  assert.deepEqual(g.insideStopIds(), ['n1']);
  assert.equal(g.update(at(240)).events.length, 0);
  assert.deepEqual(g.insideStopIds(), ['n1']);
  assert.equal(g.update(at(251)).events[0]?.type, 'exit');
  assert.deepEqual(g.insideStopIds(), []);
});

test('精度の悪い測定は判定に使わない', () => {
  const g = createGeofence([station], params);
  assert.equal(g.update(at(50, 150)).accepted, false);
  assert.deepEqual(g.insideStopIds(), []);
});

test('状態を書き出して戻せる。壊れた状態は無視する', () => {
  const g = createGeofence([station], params);
  g.update(at(100));
  const g2 = createGeofence([station], params);
  g2.importState(g.exportState());
  assert.deepEqual(g2.insideStopIds(), ['n1']);
  g2.importState({ v: 2 });
  assert.deepEqual(g2.insideStopIds(), []);
});
