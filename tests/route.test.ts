import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildNetwork, candidatesFor, choose, inferSegment, passCount, type Candidate, type RoadsData, type TransitData } from '../src/route.ts';

// 1/100000 度の整数で、小さな作りものの町を作る。経度0.01度 ≒ 905m、緯度0.01度 ≒ 1113m
const LON0 = 13930000, LAT0 = 3565000;
const at = (dx: number, dy: number) => ({ lon: (LON0 + dx) / 1e5, lat: (LAT0 + dy) / 1e5 });

/** 点の一覧と、点の番号でつないだ道(印 1=歩ける・2=バスが通る)から、build-route-data.mjs と同じ形を作る */
function roadsOf(points: [number, number][], ways: [number, number, number][]): RoadsData {
  const nodes: number[] = [];
  let px = 0, py = 0;
  for (const [dx, dy] of points) { nodes.push(LON0 + dx - px, LAT0 + dy - py); px = LON0 + dx; py = LAT0 + dy; }
  const edges: number[] = [];
  let prevA = 0;
  for (const [a, b, flag] of [...ways].sort((p, q) => p[0] - q[0])) { edges.push(a - prevA, b - a, flag, 0); prevA = a; }
  return { nodes, edges };
}

// 横一列の道(東へ 0 → 3000 →)。0〜2 は歩けてバスも通る、2〜3 は歩きだけ
const roads = roadsOf([[0, 0], [1000, 0], [2000, 0], [3000, 0]], [[0, 1, 3], [1, 2, 3], [2, 3, 1]]);
// 電車: 道から北へ 0.01度(約1.1km)離れた所を東西に走る。真ん中の駅だけ手元の駅
const transit: TransitData = {
  bus: [],
  railNodes: [[LON0, LAT0 + 1000, ''], [LON0 + 1000, LAT0 + 1000, 'st-mid'], [LON0 + 2000, LAT0 + 1000, '']],
  railEdges: [0, 1, 1, 2],
};
const spots = [
  { id: 'bus-near', ...at(500, 100) }, // 道から約110m
  { id: 'bus-far', ...at(500, 500) }, // 道から約560m
  { id: 'st-mid', ...at(1000, 1000) },
];
const net = buildNetwork(roads, transit, spots);
const MIN = 60_000;

test('歩きの道すじは、道から200m以内の場所だけを通過にする', () => {
  const walk = candidatesFor(net, at(0, 0), at(2000, 0)).find((c) => c.mode === 'walk')!;
  assert.deepEqual(walk.passes.map((p) => p.spotId), ['bus-near']);
  assert.ok(Math.abs(walk.lengthM - 1810) < 20, `${walk.lengthM}m`);
  // 通過した場所までの道のりは、道の上で近づいた所まで
  assert.ok(walk.passes[0].alongM > 300 && walk.passes[0].alongM < 500, `${walk.passes[0].alongM}m`);
});

test('バスが通らない道の先へは、バスの候補が出ない(大きな道の端まで)', () => {
  const modes = candidatesFor(net, at(0, 0), at(3000, 0)).map((c) => c.mode);
  assert.ok(modes.includes('walk'));
  assert.ok(!modes.includes('bus') || candidatesFor(net, at(0, 0), at(3000, 0)).find((c) => c.mode === 'bus')!.lengthM >= 2000);
});

test('電車の道すじは、たどった駅を通過にする(線路のそばのバス停は取らない)', () => {
  const train = candidatesFor(net, at(0, 1000), at(2000, 1000)).find((c) => c.mode === 'train')!;
  assert.ok(train.passes.some((p) => p.spotId === 'st-mid'));
  assert.ok(!train.passes.some((p) => p.spotId === 'bus-far'));
});

test('ありえない速さの区間は何も付けない。どの道も出なければバス停の回数', () => {
  assert.equal(inferSegment(net, { ...at(0, 0), t: 0 }, { ...at(2000, 0), t: 30_000 }).kind, 'none');
  // 道から遠い所どうし(道すじが出ない)
  const far = inferSegment(net, { ...at(0, 5000), t: 0 }, { ...at(2000, 5000), t: 60 * MIN });
  assert.deepEqual(far, { kind: 'count', count: 7 });
});

const cand = (mode: Candidate['mode'], fastestMin: number, typicalMin: number, ids: string[]): Candidate => ({
  mode, lengthM: 1000, fastestMs: fastestMin * MIN, typicalMs: typicalMin * MIN, line: [], passes: ids.map((spotId, i) => ({ spotId, alongM: i * 100 })),
});

test('かかった時間に合う候補が1つなら、それを使う', () => {
  const walk = cand('walk', 10, 20, ['a', 'b']), train = cand('train', 3, 15, ['x', 'y']);
  // 20分: 歩き(10分〜40分)も電車(3.3分〜32.5分)も合うが、通過が違うので聞く
  assert.equal(choose([walk, train], 20 * MIN, 0).kind, 'ask');
  // 5分: 歩きでは間に合わず、電車だけ
  const r = choose([walk, train], 5 * MIN, 0);
  assert.equal(r.kind === 'route' && r.candidate.mode, 'train');
});

test('通過する場所がほとんど同じなら、聞かずに先の候補を使う', () => {
  const walk = cand('walk', 10, 20, ['a', 'b', 'c', 'd', 'e']), bus = cand('bus', 3, 20, ['a', 'b', 'c', 'd', 'e']);
  const r = choose([walk, bus], 20 * MIN, 0);
  assert.equal(r.kind === 'route' && r.candidate.mode, 'walk');
});

test('長く止まっていた区間(どの候補にも合わない)は聞く。どの候補でも間に合わなければ何も付けない', () => {
  const walk = cand('walk', 10, 20, ['a']), train = cand('train', 3, 15, ['x']);
  const r = choose([walk, train], 300 * MIN, 0);
  assert.equal(r.kind, 'ask');
  assert.equal(r.kind === 'ask' && r.options.length, 2);
  assert.equal(choose([walk, train], 2 * MIN, 5).kind, 'none');
});

test('道すじが出ないときの回数は、直線1kmあたり4回、10回まで', () => {
  assert.equal(passCount(at(0, 0), at(1110, 0)), 4); // 約1005m
  assert.equal(passCount(at(0, 0), at(9050, 0)), 10);
  assert.equal(passCount(at(0, 0), at(200, 0)), 0);
  assert.deepEqual(choose([], MIN, 3), { kind: 'count', count: 3 });
  assert.deepEqual(choose([], MIN, 0), { kind: 'none' });
});
