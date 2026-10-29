// アプリの地図画面で使うデータを書き出す。
// public/map/base.json   … 市の形と主な道路(最初から読む)
// public/map/detail.json … 住宅街の道・歩道(拡大したときに初めて読む)
// 周りの市(町田市・多摩市・日野市)の形・道路も、八王子市と同じように入れる(駅は data/spots.json から、アプリが描く)
// (data/source/neighbors.json・neighbors_roads_all.json。取り直しは fetch-neighbors.mjs と fetch-roads.mjs --neighbors --all)
// 座標は 1/100000 度の整数にし、2点目からは前の点との差だけを持つ(ファイルを小さくするため)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { shareOutlines } from './neighbor-map.mjs';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const boundary = read('data/source/hachioji_boundary.json');
const neighbors = read('data/source/neighbors.json');
shareOutlines(neighbors.hachioji, boundary.ring, neighbors.cities);
// 道は市にかかるものを丸ごと取っているので、4市の外にはみ出した部分を切り落とす。
// 市の境目をまたぐ道は両方の市で取れているが、同じ線を2回描いても見た目は変わらないのでそのまま使う
const rings = [boundary.ring, ...neighbors.cities.map((c) => c.ring)];
const inRing = (ring, [px, py]) => {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const inside = (p) => rings.some((r) => inRing(r, p));
// 中の点 a と外の点 b のあいだで、ふちの位置を二分探索で探す
const edge = (a, b) => {
  let lo = a, hi = b;
  for (let i = 0; i < 20; i++) {
    const mid = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2];
    if (inside(mid)) lo = mid; else hi = mid;
  }
  return lo;
};
function clip(line) {
  const parts = [];
  let cur = null;
  line.forEach((p, i) => {
    const inP = inside(p);
    if (inP && !cur) cur = i ? [edge(p, line[i - 1])] : [];
    if (inP) cur.push(p);
    if (!inP && cur) { cur.push(edge(line[i - 1], p)); parts.push(cur); cur = null; }
  });
  if (cur) parts.push(cur);
  return parts.filter((l) => l.length > 1);
}
const roads = [...read('data/source/hachioji_roads_all.json').roads, ...read('data/source/neighbors_roads_all.json').roads]
  .flatMap((r) => clip(r.line).map((line) => ({ ...r, line })));

const MAIN = ['motorway', 'trunk', 'primary', 'secondary'];
const BIG = ['motorway', 'trunk'];

// 線の点を間引く。tol は度(0.00003 度 ≒ 3m)
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  const len = Math.hypot(bx - ax, by - ay) || 1e-12;
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
    if (d > max) { max = d; idx = i; }
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

function encode(line, tol) {
  // 始点と終点が同じ輪(市の形)は間引けないので、tol 0 ならそのまま使う
  const pts = (tol ? simplify(line, tol) : line).map(([lon, lat]) => [Math.round(lon * 1e5), Math.round(lat * 1e5)]);
  const out = [pts[0][0], pts[0][1]];
  for (let i = 1; i < pts.length; i++) out.push(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return out;
}

const pick = (kinds) => roads.filter((r) => kinds.includes(r.kind));
const base = {
  attribution: '© OpenStreetMap contributors (ODbL)',
  city: encode(boundary.ring, 0),
  neighbors: neighbors.cities.map((c) => encode(c.ring, 0)),
  big: pick(BIG).map((r) => encode(r.line, 0.00003)),
  mid: pick(['primary']).map((r) => encode(r.line, 0.00003)),
  small: pick(['secondary']).map((r) => encode(r.line, 0.00003)),
};
const detail = {
  attribution: '© OpenStreetMap contributors (ODbL)',
  roads: roads.filter((r) => !MAIN.includes(r.kind)).map((r) => encode(r.line, 0.00002)),
};

mkdirSync(new URL('public/map/', root), { recursive: true });
for (const [name, data] of [['base', base], ['detail', detail]]) {
  const text = JSON.stringify(data);
  writeFileSync(new URL(`public/map/${name}.json`, root), text);
  console.log(`public/map/${name}.json  ${(text.length / 1024).toFixed(0)}KB`);
}
