// 閉じている間の通過の正確さを測る(npm run route:check)。アプリの推測(src/route.ts)をそのまま使う。
// 本当に通った道は、道ごとの長さにランダムな倍率(0.6〜1.4)を掛けたうえでの最短経路で作る(人はいつも最短の道を通らないため)。
// 本当に通った場所 = その道から200m以内。乗り物を聞かれたら、本当の乗り物を答えたことにする。電車は測っていない
import { readFileSync } from 'node:fs';
import { buildNetwork, inferSegment } from '../src/route.ts';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const spots = read('data/spots.json').spots;
const net = buildNetwork(read('public/route/roads.json'), read('public/route/transit.json'), spots);
const TRIPS = Number(process.argv[2] ?? 150);

let seed = 12345;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const MY = 111_320, MX = MY * Math.cos((35.62 * Math.PI) / 180);
const ll = (x, y) => ({ lat: y / MY, lon: x / MX });

function truthPath(s, t, mask, mult) {
  const n = net.nx.length, g = new Float64Array(n).fill(Infinity), via = new Int32Array(n).fill(-1), done = new Uint8Array(n);
  const heap = [[0, s]];
  g[s] = 0;
  while (heap.length) {
    heap.sort((a, b) => b[0] - a[0]);
    const [d, u] = heap.pop();
    if (done[u]) continue;
    done[u] = 1;
    if (u === t) break;
    for (let j = net.adjStart[u]; j < net.adjStart[u + 1]; j++) {
      const e = net.adjEdge[j];
      if (!(net.eflag[e] & mask)) continue;
      const w = net.ea[e] === u ? net.eb[e] : net.ea[e];
      const nd = d + net.elen[e] * mult[e];
      if (nd < g[w]) { g[w] = nd; via[w] = e; heap.push([nd, w]); }
    }
  }
  if (!Number.isFinite(g[t])) return null;
  const pts = [[net.nx[t], net.ny[t]]];
  let len = 0;
  for (let u = t; u !== s;) {
    const e = via[u], from = net.ea[e] === u ? net.eb[e] : net.ea[e];
    const mids = [];
    for (let j = net.geoStart[e]; j < net.geoStart[e + 1]; j++) mids.push([net.geo[2 * j], net.geo[2 * j + 1]]);
    if (net.eb[e] === u) mids.reverse();
    pts.push(...mids, [net.nx[from], net.ny[from]]);
    len += net.elen[e];
    u = from;
  }
  return { pts: pts.reverse(), len };
}

const segDist = (p, a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
  const t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)) : 0;
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};
const near = (pts) => new Set(net.spots.filter((s) => {
  for (let i = 1; i < pts.length; i++) if (segDist(s.p, pts[i - 1], pts[i]) <= 200) return true;
  return false;
}).map((s) => s.id));

function run(label, mode, mask, minM, maxM, msFor) {
  const nodesOf = [];
  for (let i = 0; i < net.nx.length; i++) if (net.nflag[i] & mask) nodesOf.push(i);
  let n = 0, truthSum = 0, hit = 0, given = 0, asked = 0, counted = 0, nothing = 0;
  const T0 = new Date(2026, 9, 30, 8, 0, 0).getTime();
  while (n < TRIPS) {
    const s = nodesOf[Math.floor(rand() * nodesOf.length)], t = nodesOf[Math.floor(rand() * nodesOf.length)];
    const straight = Math.hypot(net.nx[s] - net.nx[t], net.ny[s] - net.ny[t]);
    if (straight < minM || straight > maxM) continue;
    const mult = new Float64Array(net.elen.length).map(() => 0.6 + 0.8 * rand());
    const tp = truthPath(s, t, mask, mult);
    if (!tp) continue;
    n++;
    const truth = near(tp.pts);
    truthSum += truth.size;
    const r = inferSegment(net, { ...ll(net.nx[s], net.ny[s]), t: T0 }, { ...ll(net.nx[t], net.ny[t]), t: T0 + msFor(tp.len) });
    let cand = null;
    if (r.kind === 'route') cand = r.candidate;
    else if (r.kind === 'ask') { asked++; cand = r.options.find((c) => c.mode === mode) ?? r.options[0]; }
    else if (r.kind === 'count') counted++;
    else nothing++;
    for (const p of cand?.passes ?? []) { given++; if (truth.has(p.spotId)) hit++; }
  }
  const pct = (a, b) => `${Math.round((100 * a) / Math.max(1, b))}%`;
  console.log(`${label}(${n}回): 取れる割合 ${pct(hit, truthSum)}・当たり ${pct(hit, given)}・聞かれた ${pct(asked, n)}・回数だけ ${pct(counted, n)}・何も付かない ${pct(nothing, n)}`);
}

const WALK = 1, BUS = 2;
// 歩きは時速4.5km、バスは時速18km+待ち5分で移動したことにする
run('歩き 1〜3km', 'walk', WALK, 1000, 3000, (m) => (m / 4500) * 3_600_000);
run('バス 3〜8km', 'bus', BUS, 3000, 8000, (m) => (m / 18000) * 3_600_000 + 5 * 60_000);
