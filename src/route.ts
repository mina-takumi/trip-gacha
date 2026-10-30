import { CONFIG } from './config.ts';

// 閉じている間に通った場所の推測。前に開いていた最後の位置と、開き直した位置の間を、
// 歩き・バス・電車の道すじで結び、道から200m以内の駅・バス停を「通過」にする。
// データは public/route/(scripts/build-route-data.mjs が作る)

export interface RoadsData { nodes: number[]; edges: number[] }
export interface TransitData { bus: number[][]; railNodes: [number, number, string][]; railEdges: number[] }
export interface SpotPoint { id: string; lat: number; lon: number }
export interface LatLon { lat: number; lon: number }

export type PassMode = 'walk' | 'bus' | 'train';
export const PASS_MODE_LABEL: Record<PassMode, string> = { walk: '歩き', bus: 'バス', train: '電車' };

/** 通過した場所と、出発地からそこまでの道のり */
export interface Pass { spotId: string; alongM: number }
export interface Candidate {
  mode: PassMode;
  lengthM: number;
  /** これより速くは着けない時間 */
  fastestMs: number;
  /** ふつうにかかる時間(待ち時間を含む) */
  typicalMs: number;
  line: LatLon[];
  passes: Pass[];
}
export type Inference =
  | { kind: 'route'; candidate: Candidate }
  | { kind: 'ask'; options: Candidate[] }
  | { kind: 'count'; count: number }
  | { kind: 'none' };

// 平らな地図に置き直して m で計算する(推測する範囲は数十km なので、ずれは小さい)
const LAT0 = 35.62;
const MY = 111_320;
const MX = MY * Math.cos((LAT0 * Math.PI) / 180);
type P = [number, number];
const toP = (lat: number, lon: number): P => [lon * MX, lat * MY];
const toLatLon = (p: P): LatLon => ({ lat: p[1] / MY, lon: p[0] / MX });
const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const msFor = (m: number, kmh: number) => (m / (kmh * 1000)) * 3_600_000;

const CELL = 250;
const cellKey = (cx: number, cy: number) => cx * 100_000 + cy;
const WALK = 1, BUS = 2;

export interface Network {
  nx: Float64Array; ny: Float64Array; nflag: Uint8Array;
  adjStart: Int32Array; adjEdge: Int32Array;
  ea: Int32Array; eb: Int32Array; eflag: Uint8Array; elen: Float64Array;
  /** 線の途中の点。線 i の点は geo[geoStart[i]*2 .. geoStart[i+1]*2] */
  geoStart: Int32Array; geo: Float64Array;
  nodeGrid: Map<number, number[]>;
  bus: { pts: P[]; cum: number[] }[];
  rail: { pts: P[]; spot: string[]; adj: { to: number; m: number }[][] };
  spots: { id: string; p: P }[];
  spotGrid: Map<number, number[]>;
}

function addToGrid(grid: Map<number, number[]>, p: P, i: number): void {
  const k = cellKey(Math.floor(p[0] / CELL), Math.floor(p[1] / CELL));
  const list = grid.get(k);
  if (list) list.push(i); else grid.set(k, [i]);
}

/** p から r 以内のマスに入っている番号を全部返す */
function nearInGrid(grid: Map<number, number[]>, p: P, r: number): number[] {
  const out: number[] = [];
  const x0 = Math.floor((p[0] - r) / CELL), x1 = Math.floor((p[0] + r) / CELL);
  const y0 = Math.floor((p[1] - r) / CELL), y1 = Math.floor((p[1] + r) / CELL);
  for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) {
    const list = grid.get(cellKey(cx, cy));
    if (list) out.push(...list);
  }
  return out;
}

const decodeLine = (flat: number[]): P[] => {
  const pts: P[] = [];
  let x = 0, y = 0;
  for (let i = 0; i < flat.length; i += 2) {
    x += flat[i]; y += flat[i + 1];
    pts.push(toP(y / 1e5, x / 1e5));
  }
  return pts;
};

export function buildNetwork(roads: RoadsData, transit: TransitData, spots: SpotPoint[]): Network {
  const n = roads.nodes.length / 2;
  const ix = new Int32Array(n), iy = new Int32Array(n);
  const nx = new Float64Array(n), ny = new Float64Array(n);
  let x = 0, y = 0;
  for (let i = 0; i < n; i++) {
    x += roads.nodes[2 * i]; y += roads.nodes[2 * i + 1];
    ix[i] = x; iy[i] = y;
    [nx[i], ny[i]] = toP(y / 1e5, x / 1e5);
  }

  const ea: number[] = [], eb: number[] = [], eflag: number[] = [], elen: number[] = [], geoStart: number[] = [0], geo: number[] = [];
  const E = roads.edges;
  let prevA = 0;
  for (let k = 0; k < E.length;) {
    const a = prevA + E[k], b = a + E[k + 1], flag = E[k + 2], mids = E[k + 3];
    prevA = a;
    k += 4;
    let qx = ix[a], qy = iy[a];
    let last: P = [nx[a], ny[a]];
    let len = 0;
    for (let j = 0; j < mids; j++, k += 2) {
      qx += E[k]; qy += E[k + 1];
      const p = toP(qy / 1e5, qx / 1e5);
      geo.push(p[0], p[1]);
      len += dist(last, p);
      last = p;
    }
    len += dist(last, [nx[b], ny[b]]);
    ea.push(a); eb.push(b); eflag.push(flag); elen.push(len); geoStart.push(geo.length / 2);
  }

  const nflag = new Uint8Array(n);
  const deg = new Int32Array(n + 1);
  for (let e = 0; e < ea.length; e++) {
    deg[ea[e] + 1]++; deg[eb[e] + 1]++;
    nflag[ea[e]] |= eflag[e]; nflag[eb[e]] |= eflag[e];
  }
  for (let i = 0; i < n; i++) deg[i + 1] += deg[i];
  const adjStart = Int32Array.from(deg);
  const fill = Int32Array.from(deg);
  const adjEdge = new Int32Array(ea.length * 2);
  for (let e = 0; e < ea.length; e++) { adjEdge[fill[ea[e]]++] = e; adjEdge[fill[eb[e]]++] = e; }

  const nodeGrid = new Map<number, number[]>();
  for (let i = 0; i < n; i++) addToGrid(nodeGrid, [nx[i], ny[i]], i);

  const bus = transit.bus.map((flat) => {
    const pts = decodeLine(flat);
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + dist(pts[i - 1], pts[i]));
    return { pts, cum };
  });

  const railPts = transit.railNodes.map(([lon, lat]) => toP(lat / 1e5, lon / 1e5));
  const adj: { to: number; m: number }[][] = railPts.map(() => []);
  for (let i = 0; i < transit.railEdges.length; i += 2) {
    const a = transit.railEdges[i], b = transit.railEdges[i + 1], m = dist(railPts[a], railPts[b]);
    adj[a].push({ to: b, m }); adj[b].push({ to: a, m });
  }

  const sp = spots.map((s) => ({ id: s.id, p: toP(s.lat, s.lon) }));
  const spotGrid = new Map<number, number[]>();
  sp.forEach((s, i) => addToGrid(spotGrid, s.p, i));

  return {
    nx, ny, nflag, adjStart, adjEdge,
    ea: Int32Array.from(ea), eb: Int32Array.from(eb), eflag: Uint8Array.from(eflag), elen: Float64Array.from(elen),
    geoStart: Int32Array.from(geoStart), geo: Float64Array.from(geo),
    nodeGrid, bus, rail: { pts: railPts, spot: transit.railNodes.map((r) => r[2]), adj }, spots: sp, spotGrid,
  };
}

function nearestNode(net: Network, p: P, mask: number, maxM: number): number | null {
  let best: number | null = null, bestD = maxM;
  for (const i of nearInGrid(net.nodeGrid, p, maxM)) {
    if (!(net.nflag[i] & mask)) continue;
    const d = Math.hypot(net.nx[i] - p[0], net.ny[i] - p[1]);
    if (d <= bestD) { bestD = d; best = i; }
  }
  return best;
}

/** 小さい順に取り出せる入れ物(A* 用) */
class Heap {
  private k: number[] = [];
  private v: number[] = [];
  get size() { return this.k.length; }
  push(key: number, val: number): void {
    const k = this.k, v = this.v;
    let i = k.length;
    k.push(key); v.push(val);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (k[p] <= key) break;
      k[i] = k[p]; v[i] = v[p]; i = p;
    }
    k[i] = key; v[i] = val;
  }
  pop(): number {
    const k = this.k, v = this.v;
    const top = v[0];
    const lk = k.pop()!, lv = v.pop()!;
    if (k.length) {
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = -1;
        if (l < k.length) m = r < k.length && k[r] < k[l] ? r : l;
        if (m < 0 || k[m] >= lk) break;
        k[i] = k[m]; v[i] = v[m]; i = m;
      }
      k[i] = lk; v[i] = lv;
    }
    return top;
  }
}

/** 道の上で s から t までのいちばん短い道すじ(mask の印がある道だけ通る)。点の並びと長さ */
function shortestRoad(net: Network, s: number, t: number, mask: number): { pts: P[]; m: number } | null {
  const n = net.nx.length;
  const g = new Float64Array(n).fill(Infinity);
  const via = new Int32Array(n).fill(-1);
  const tx = net.nx[t], ty = net.ny[t];
  const h = (i: number) => Math.hypot(net.nx[i] - tx, net.ny[i] - ty);
  const heap = new Heap();
  g[s] = 0;
  heap.push(h(s), s);
  const done = new Uint8Array(n);
  while (heap.size) {
    const u = heap.pop();
    if (done[u]) continue;
    done[u] = 1;
    if (u === t) break;
    for (let j = net.adjStart[u]; j < net.adjStart[u + 1]; j++) {
      const e = net.adjEdge[j];
      if (!(net.eflag[e] & mask)) continue;
      const w = net.ea[e] === u ? net.eb[e] : net.ea[e];
      const ng = g[u] + net.elen[e];
      if (ng < g[w]) { g[w] = ng; via[w] = e; heap.push(ng + h(w), w); }
    }
  }
  if (!Number.isFinite(g[t])) return null;
  // t から戻りながら線をつなぐ
  const rev: P[] = [[net.nx[t], net.ny[t]]];
  for (let u = t; u !== s;) {
    const e = via[u];
    const from = net.ea[e] === u ? net.eb[e] : net.ea[e];
    const mids: P[] = [];
    for (let j = net.geoStart[e]; j < net.geoStart[e + 1]; j++) mids.push([net.geo[2 * j], net.geo[2 * j + 1]]);
    // 線の点は ea → eb の向き。u から戻るので、u が eb なら後ろから
    if (net.eb[e] === u) mids.reverse();
    rev.push(...mids, [net.nx[from], net.ny[from]]);
    u = from;
  }
  return { pts: rev.reverse(), m: g[t] };
}

const lineLength = (pts: P[]) => pts.reduce((sum, p, i) => (i ? sum + dist(pts[i - 1], p) : 0), 0);

/** 線から near 以内の駅・バス停と、線の始まりからそこまでの道のり(最初に近づいた所) */
function passesAlong(net: Network, line: P[], near: number, offsetM = 0): Pass[] {
  const found = new Map<string, number>();
  let cum = offsetM;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i];
    const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy, L = Math.sqrt(L2);
    const mid: P = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    for (const si of nearInGrid(net.spotGrid, mid, L / 2 + near)) {
      const s = net.spots[si];
      const t = L2 ? Math.max(0, Math.min(1, ((s.p[0] - a[0]) * dx + (s.p[1] - a[1]) * dy) / L2)) : 0;
      const d = Math.hypot(s.p[0] - a[0] - t * dx, s.p[1] - a[1] - t * dy);
      if (d <= near && !found.has(s.id)) found.set(s.id, cum + t * L);
    }
    cum += L;
  }
  return [...found].map(([spotId, alongM]) => ({ spotId, alongM })).sort((x, y) => x.alongM - y.alongM);
}

function walkCandidate(net: Network, A: P, B: P): Candidate | null {
  const s = nearestNode(net, A, WALK, CONFIG.passSnapM), t = nearestNode(net, B, WALK, CONFIG.passSnapM);
  if (s == null || t == null) return null;
  const r = s === t ? { pts: [[net.nx[s], net.ny[s]] as P], m: 0 } : shortestRoad(net, s, t, WALK);
  if (!r) return null;
  const pts = [A, ...r.pts, B];
  const m = lineLength(pts);
  return {
    mode: 'walk', lengthM: m, fastestMs: msFor(m, CONFIG.passWalkMaxKmh), typicalMs: msFor(m, CONFIG.passWalkKmh),
    line: pts.map(toLatLon), passes: passesAlong(net, pts, CONFIG.passNearM),
  };
}

/** バス: 出発地と到着地の近くをこの順で通るバス路線があれば、いちばん早いもの。無ければ大きな道のいちばん短い道すじ */
function busCandidate(net: Network, A: P, B: P): Candidate | null {
  let best: { pts: P[]; walkM: number; rideM: number } | null = null;
  const near = CONFIG.passBusLineM;
  const cost = (walkM: number, rideM: number) => msFor(walkM, CONFIG.passWalkKmh) + msFor(rideM, CONFIG.passBusKmh);
  for (const line of net.bus) {
    let ia = -1, da = near, ib = -1, db = near;
    line.pts.forEach((p, i) => {
      const a = dist(p, A), b = dist(p, B);
      if (a < da) { da = a; ia = i; }
      if (b < db) { db = b; ib = i; }
    });
    if (ia < 0 || ib <= ia) continue;
    const rideM = line.cum[ib] - line.cum[ia];
    if (!best || cost(da + db, rideM) < cost(best.walkM, best.rideM)) best = { pts: [A, ...line.pts.slice(ia, ib + 1), B], walkM: da + db, rideM };
  }
  if (!best) {
    const s = nearestNode(net, A, BUS, CONFIG.passBusLineM), t = nearestNode(net, B, BUS, CONFIG.passBusLineM);
    if (s == null || t == null || s === t) return null;
    const r = shortestRoad(net, s, t, BUS);
    if (!r) return null;
    best = { pts: [A, ...r.pts, B], walkM: dist(A, r.pts[0]) + dist(B, r.pts[r.pts.length - 1]), rideM: r.m };
  }
  return {
    mode: 'bus', lengthM: best.walkM + best.rideM,
    fastestMs: msFor(best.walkM, CONFIG.passWalkMaxKmh) + msFor(best.rideM, CONFIG.passBusMaxKmh),
    typicalMs: cost(best.walkM, best.rideM) + CONFIG.passBusWaitMs,
    line: best.pts.map(toLatLon), passes: passesAlong(net, best.pts, CONFIG.passNearM),
  };
}

/**
 * 電車: 出発地・到着地から歩いて行ける駅の間を、駅のつながりの上でいちばん早く結ぶ(乗り換えもできる)。
 * 通過は、たどった駅と、両端の歩き(まっすぐ)の近く。電車の中から線路の近くのバス停は取らない
 */
function trainCandidate(net: Network, A: P, B: P): Candidate | null {
  const { pts, adj, spot } = net.rail;
  const reach = CONFIG.passStationWalkM;
  const walkMs = (m: number) => msFor(m, CONFIG.passWalkKmh);
  const time = new Float64Array(pts.length).fill(Infinity);
  const via = new Int32Array(pts.length).fill(-1);
  const heap = new Heap();
  pts.forEach((p, i) => {
    const d = dist(p, A);
    if (d <= reach) { time[i] = walkMs(d); heap.push(time[i], i); }
  });
  const done = new Uint8Array(pts.length);
  while (heap.size) {
    const u = heap.pop();
    if (done[u]) continue;
    done[u] = 1;
    for (const { to, m } of adj[u]) {
      const t = time[u] + msFor(m, CONFIG.passTrainKmh);
      if (t < time[to]) { time[to] = t; via[to] = u; heap.push(t, to); }
    }
  }
  let end = -1, endMs = Infinity;
  pts.forEach((p, i) => {
    const d = dist(p, B);
    if (d <= reach && time[i] + walkMs(d) < endMs) { endMs = time[i] + walkMs(d); end = i; }
  });
  if (end < 0 || via[end] < 0) return null;
  const path: number[] = [];
  for (let u = end; u >= 0; u = via[u]) path.push(u);
  path.reverse();
  const railPts = path.map((i) => pts[i]);
  const legA = dist(A, railPts[0]), legB = dist(railPts[railPts.length - 1], B);
  const rideM = lineLength(railPts);
  // 通過: 出発地から最初の駅までの歩き、たどった駅、最後の駅から到着地までの歩き
  const passes = new Map<string, number>();
  for (const p of passesAlong(net, [A, railPts[0]], CONFIG.passNearM)) passes.set(p.spotId, p.alongM);
  let along = legA;
  path.forEach((i, k) => {
    if (k) along += dist(pts[path[k - 1]], pts[i]);
    if (spot[i] && !passes.has(spot[i])) passes.set(spot[i], along);
  });
  for (const p of passesAlong(net, [railPts[railPts.length - 1], B], CONFIG.passNearM, legA + rideM)) if (!passes.has(p.spotId)) passes.set(p.spotId, p.alongM);
  return {
    mode: 'train', lengthM: legA + rideM + legB,
    fastestMs: msFor(legA + legB, CONFIG.passWalkMaxKmh) + msFor(rideM, CONFIG.passTrainMaxKmh),
    typicalMs: walkMs(legA + legB) + msFor(rideM, CONFIG.passTrainKmh) + CONFIG.passTrainWaitMs,
    line: [A, ...railPts, B].map(toLatLon),
    passes: [...passes].map(([spotId, alongM]) => ({ spotId, alongM })).sort((x, y) => x.alongM - y.alongM),
  };
}

export function candidatesFor(net: Network, from: LatLon, to: LatLon): Candidate[] {
  const A = toP(from.lat, from.lon), B = toP(to.lat, to.lon);
  return [walkCandidate(net, A, B), busCandidate(net, A, B), trainCandidate(net, A, B)].filter((c): c is Candidate => c != null);
}

/** 道すじが出ないときに渡すバス停の回す回数 */
export function passCount(from: LatLon, to: LatLon): number {
  const m = dist(toP(from.lat, from.lon), toP(to.lat, to.lon));
  return Math.min(CONFIG.passCountMax, Math.floor((m / 1000) * CONFIG.passCountPerKm));
}

const sameRatio = (a: Candidate, b: Candidate) => {
  const sa = new Set(a.passes.map((p) => p.spotId));
  const both = b.passes.filter((p) => sa.has(p.spotId)).length;
  const all = new Set([...sa, ...b.passes.map((p) => p.spotId)]).size;
  return all ? both / all : 1;
};

/**
 * 候補とかかった時間から決める。どの候補でも時間が足りなければ何も付けない。
 * かかった時間に合う候補((ふつうの時間 − 10分) ÷ 1.5 から、ふつうの時間 × 1.5 + 10分 まで)が1つならそれ。0個か2個以上なら聞く。
 * ただし聞く候補どうしで通過する場所がほとんど同じなら、聞かずに先のもの(歩き → バス → 電車の順)を使う
 */
export function choose(cands: Candidate[], elapsedMs: number, count: number): Inference {
  if (cands.length === 0) return count > 0 ? { kind: 'count', count } : { kind: 'none' };
  const possible = cands.filter((c) => c.fastestMs <= elapsedMs);
  if (possible.length === 0) return { kind: 'none' };
  const fit = possible.filter((c) => elapsedMs <= c.typicalMs * CONFIG.passFitFactor + CONFIG.passFitSlackMs
    && elapsedMs >= (c.typicalMs - CONFIG.passFitSlackMs) / CONFIG.passFitFactor);
  if (fit.length === 1) return { kind: 'route', candidate: fit[0] };
  const options = fit.length ? fit : possible;
  if (options.every((c) => sameRatio(c, options[0]) >= CONFIG.passSameRatio)) return { kind: 'route', candidate: options[0] };
  return { kind: 'ask', options };
}

export function inferSegment(net: Network, from: LatLon & { t: number }, to: LatLon & { t: number }): Inference {
  return choose(candidatesFor(net, from, to), to.t - from.t, passCount(from, to));
}
