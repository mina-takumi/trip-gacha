// 閉じている間に通った場所を推測するためのデータを public/route/ に書き出す(npm run route:data)。
// public/route/roads.json   … 道のつながり(交差点と、交差点どうしを結ぶ線)。歩ける道か、バスが通る道かの印つき
// public/route/transit.json … バス路線の形と、電車の駅のつながり(停車駅の順)
// 元のデータは data/source/ の道路(fetch-roads.mjs)と路線(fetch-transit.mjs)
// 座標は 1/100000 度の整数にし、2点目からは前の点との差だけを持つ(ファイルを小さくするため)
import { gzipSync } from 'node:zlib';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { haversineDistanceM } from '../src/geofence.ts';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const spots = read('data/spots.json').spots;

const NOT_WALK = ['motorway'];
const BUS = ['trunk', 'primary', 'secondary', 'tertiary', 'unclassified'];
const WALK_FLAG = 1, BUS_FLAG = 2;

const toInt = ([lon, lat]) => [Math.round(lon * 1e5), Math.round(lat * 1e5)];
const keyOf = ([x, y]) => x * 1e8 + y;

// 線の点を間引く(座標は整数。tol 5 ≒ 5m)
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  const len = Math.hypot(bx - ax, by - ay) || 1e-9;
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
    if (d > max) { max = d; idx = i; }
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

// ---------- 道 ----------
const ways = [...read('data/source/hachioji_roads_all.json').roads, ...read('data/source/neighbors_roads_all.json').roads]
  .map((r) => ({ flag: (NOT_WALK.includes(r.kind) ? 0 : WALK_FLAG) | (BUS.includes(r.kind) ? BUS_FLAG : 0), pts: r.line.map(toInt) }))
  .filter((w) => w.flag && w.pts.length >= 2);
// 市の境目をまたぐ道は2つの市で同じものが取れているので、同じ形のものは1つにする
const seenWay = new Set();
const uniqWays = ways.filter((w) => {
  const k = w.pts.map((p) => p.join(',')).join(';');
  if (seenWay.has(k)) return false;
  seenWay.add(k);
  return true;
});

// 交差点 = 道の端か、2回以上出てくる点
const uses = new Map();
for (const w of uniqWays) {
  w.pts.forEach((p, i) => {
    const k = keyOf(p);
    uses.set(k, (uses.get(k) ?? 0) + (i === 0 || i === w.pts.length - 1 ? 2 : 1));
  });
}
const nodeIndex = new Map();
const nodes = [];
const nodeOf = (p) => {
  const k = keyOf(p);
  let i = nodeIndex.get(k);
  if (i == null) { i = nodes.length; nodeIndex.set(k, i); nodes.push(p); }
  return i;
};
const edges = [];
for (const w of uniqWays) {
  let start = 0;
  for (let i = 1; i < w.pts.length; i++) {
    if (uses.get(keyOf(w.pts[i])) < 2 && i < w.pts.length - 1) continue;
    const seg = simplify(w.pts.slice(start, i + 1), 5);
    const a = nodeOf(seg[0]), b = nodeOf(seg[seg.length - 1]);
    if (a !== b || seg.length > 2) edges.push({ a, b, flag: w.flag, mid: seg.slice(1, -1) });
    start = i;
  }
}
// 番号を位置の順に並べ替える(差が小さくなり、ファイルが小さくなる)
const order = nodes.map((_, i) => i).sort((i, j) => nodes[i][0] - nodes[j][0] || nodes[i][1] - nodes[j][1]);
const newId = new Int32Array(nodes.length);
order.forEach((old, i) => { newId[old] = i; });
const nodeFlat = [];
let prev = [0, 0];
for (const old of order) {
  const p = nodes[old];
  nodeFlat.push(p[0] - prev[0], p[1] - prev[1]);
  prev = p;
}
// 線: [a, bとaの差, 印, 途中の点の数, 途中の点(前の点との差)...]
edges.sort((e, f) => newId[e.a] - newId[f.a]);
const edgeFlat = [];
let prevA = 0;
for (const e of edges) {
  const a = newId[e.a], b = newId[e.b];
  edgeFlat.push(a - prevA, b - a, e.flag, e.mid.length);
  prevA = a;
  let q = nodes[e.a];
  for (const p of e.mid) { edgeFlat.push(p[0] - q[0], p[1] - q[1]); q = p; }
}
const roads = { attribution: '© OpenStreetMap contributors (ODbL)', nodes: nodeFlat, edges: edgeFlat };

// ---------- バス路線 ----------
// 路線の道を順につなぐ。向きが逆の道はひっくり返す
function chain(waysOfRoute) {
  const list = waysOfRoute.map((w) => w.map(toInt));
  const same = (p, q) => p[0] === q[0] && p[1] === q[1];
  let line = [...list[0]];
  if (list.length > 1 && !same(line[line.length - 1], list[1][0]) && !same(line[line.length - 1], list[1][list[1].length - 1])) line.reverse();
  for (const w of list.slice(1)) {
    const end = line[line.length - 1];
    const part = same(end, w[w.length - 1]) ? [...w].reverse() : w;
    line.push(...(same(end, part[0]) ? part.slice(1) : part));
  }
  return line;
}
const busSeen = new Set();
const busLines = [];
for (const r of read('data/source/bus_routes.json').routes) {
  const line = simplify(chain(r.ways), 10);
  const k = line.map((p) => p.join(',')).join(';');
  if (line.length < 2 || busSeen.has(k)) continue;
  busSeen.add(k);
  const flat = [line[0][0], line[0][1]];
  for (let i = 1; i < line.length; i++) flat.push(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
  busLines.push(flat);
}

// ---------- 電車の駅のつながり ----------
// 停車位置は路線ごとに別の点なので、同じ名前で300m以内のものを1つの駅にまとめる。
// 手元の駅(spots.json の駅)から400m以内なら、その駅の番号を付ける(通過したらその駅の権利になる)
const stationSpots = spots.filter((s) => s.kind === 'station');
const railNodes = [];
const railNodeOf = ([lon, lat, name]) => {
  let n = railNodes.find((r) => r.name === name && haversineDistanceM(r.lat, r.lon, lat, lon) < 300);
  if (!n) {
    let spotId = '', best = 400;
    for (const s of stationSpots) {
      const d = haversineDistanceM(s.lat, s.lon, lat, lon);
      if (d < best) { best = d; spotId = s.id; }
    }
    n = { i: railNodes.length, lon, lat, name, spotId };
    railNodes.push(n);
  }
  return n.i;
};
const railEdgeSet = new Set();
for (const r of read('data/source/rail_routes.json').routes) {
  const ids = r.stops.map(railNodeOf);
  for (let k = 1; k < ids.length; k++) {
    const [a, b] = [ids[k - 1], ids[k]].sort((x, y) => x - y);
    if (a !== b) railEdgeSet.add(`${a},${b}`);
  }
}
// 特急・快速は途中の駅を飛ばしてつながる(高尾 → 八王子 など)。そのままだと、いちばん短い道すじが途中の駅を通らない。
// 各駅をたどってもほぼ同じ長さ(1.1倍まで)で着けるつながりは、飛ばしているとみなして消す
const railDist = (a, b) => haversineDistanceM(railNodes[a].lat, railNodes[a].lon, railNodes[b].lat, railNodes[b].lon);
const railAdj = railNodes.map(() => new Set());
for (const s of railEdgeSet) { const [a, b] = s.split(',').map(Number); railAdj[a].add(b); railAdj[b].add(a); }
function viaOthers(a, b, limit) {
  const best = new Map([[a, 0]]);
  const queue = [a];
  while (queue.length) {
    const u = queue.shift();
    for (const w of railAdj[u]) {
      if (u === a && w === b) continue;
      const d = best.get(u) + railDist(u, w);
      if (d > limit || d >= (best.get(w) ?? Infinity)) continue;
      best.set(w, d);
      queue.push(w);
    }
  }
  return best.has(b);
}
let skipped = 0;
for (const s of [...railEdgeSet].sort((x, y) => { const [a, b] = x.split(',').map(Number), [c, d] = y.split(',').map(Number); return railDist(c, d) - railDist(a, b); })) {
  const [a, b] = s.split(',').map(Number);
  if (viaOthers(a, b, railDist(a, b) * 1.1)) {
    railEdgeSet.delete(s); railAdj[a].delete(b); railAdj[b].delete(a);
    skipped++;
  }
}
console.log(`駅を飛ばすつながりを ${skipped}本 消した`);

const transit = {
  attribution: '© OpenStreetMap contributors (ODbL)',
  bus: busLines,
  railNodes: railNodes.map((n) => [Math.round(n.lon * 1e5), Math.round(n.lat * 1e5), n.spotId]),
  railEdges: [...railEdgeSet].flatMap((s) => s.split(',').map(Number)),
};

mkdirSync(new URL('public/route/', root), { recursive: true });
for (const [name, data] of [['roads', roads], ['transit', transit]]) {
  const text = JSON.stringify(data);
  writeFileSync(new URL(`public/route/${name}.json`, root), text);
  console.log(`public/route/${name}.json  ${(text.length / 1024).toFixed(0)}KB(圧縮後 ${(gzipSync(text).length / 1024).toFixed(0)}KB)`);
}
console.log(`交差点 ${nodes.length}・線 ${edges.length}・バス路線 ${busLines.length}・電車の駅 ${railNodes.length}(手元の駅と対応 ${new Set(railNodes.map((n) => n.spotId).filter(Boolean)).size}/${stationSpots.length})・駅のつながり ${railEdgeSet.size}`);
