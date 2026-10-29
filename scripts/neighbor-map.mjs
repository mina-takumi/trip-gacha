// 周りの市(data/source/neighbors.json)を地図に描くための下ごしらえ。
// 簡略地図(build-map.mjs)とアプリの地図データ(build-map-data.mjs)の両方が使う

// 線の点を間引く(ずれ tol 以内)
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

// 周りの市の輪郭は間引いていない細かい形なので、八王子市と同じくらいに間引く。
// 市ごとに間引くと隣どうしの境目がずれてすき間ができるので、境目ごとに同じ形に間引いて両側の市で使う。
// 八王子市との境目は、八王子市の輪郭(hachioji_boundary.json)の線をそのまま使う
export function shareOutlines(ownFull, ownRing, cities) {
  const lats = ownRing.map((p) => p[1]);
  const kx = Math.cos(((Math.min(...lats) + Math.max(...lats)) / 2) * Math.PI / 180);
  const key = (p) => p.join(',');
  const P = (p) => [p[0] * kx, p[1]];
  const U = ([x, y]) => [x / kx, y];
  // 八王子市の輪郭上の一番近い点(輪郭に沿った位置 s つき)
  const segs = ownRing.slice(0, -1).map((a, i) => [P(a), P(ownRing[i + 1])]);
  const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const total = lens.reduce((t, l) => t + l, 0);
  const cache = new Map();
  const near = (p) => {
    if (cache.has(key(p))) return cache.get(key(p));
    const q = P(p);
    let best = { d: Infinity }, acc = 0;
    segs.forEach(([a, b], i) => {
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
      const x = a[0] + dx * t, y = a[1] + dy * t, d = Math.hypot(q[0] - x, q[1] - y);
      if (d < best.d) best = { d, s: acc + lens[i] * t, pt: U([x, y]) };
      acc += lens[i];
    });
    cache.set(key(p), best);
    return best;
  };
  // 八王子市の輪郭を s1 から s2 までたどったときに通る頂点(短い向き)
  const between = (s1, s2) => {
    const fwd = ((s2 - s1) % total + total) % total;
    const dir = fwd <= total / 2 ? 1 : -1;
    const span = dir === 1 ? fwd : total - fwd;
    const pos = []; let acc = 0;
    for (let i = 0; i < ownRing.length - 1; i++) { pos.push([acc, ownRing[i]]); acc += lens[i]; }
    return pos.map(([s, p]) => [dir === 1 ? ((s - s1) % total + total) % total : ((s1 - s) % total + total) % total, p])
      .filter(([o]) => o > 0 && o < span).sort((x, y) => x[0] - y[0]).map(([, p]) => p);
  };

  // 点ごとに、その点を輪郭に持つ市(OSM では隣の市との境目は同じ点を共有している)
  const ownSet = new Set(ownFull.map(key));
  const owners = new Map();
  for (const [name, ring] of [['八王子市', ownFull], ...cities.map((c) => [c.name, c.ring])]) {
    for (const p of ring) {
      if (!owners.has(key(p))) owners.set(key(p), new Set());
      owners.get(key(p)).add(name);
    }
  }
  const tag = (p) => [...owners.get(key(p))].sort().join();
  const at = (p) => (ownSet.has(key(p)) ? near(p).pt : p);

  for (const c of cities) {
    const pts = c.ring.slice(0, -1), n = pts.length;
    const tags = pts.map(tag);
    // 接する市が変わる点で輪郭を区切る
    const isNode = (i) => tags[i] !== tags[(i + n - 1) % n] || tags[i] !== tags[(i + 1) % n];
    const start = pts.findIndex((_, i) => isNode(i));
    if (start < 0) { c.ring = simplify(c.ring.map(P), 0.003).map(U); continue; }
    const out = [];
    let a = start;
    do {
      let b = (a + 1) % n;
      while (!isNode(b)) b = (b + 1) % n;
      const chain = [];
      for (let i = a; ; i = (i + 1) % n) { chain.push(pts[i]); if (i === b) break; }
      if (chain.every((p) => ownSet.has(key(p)))) {
        out.push(at(chain[0]), ...between(near(chain[0]).s, near(chain.at(-1)).s));
      } else {
        // 両側の市で同じ形になるよう、決まった向きで間引く
        const rev = key(chain[0]) > key(chain.at(-1));
        const line = simplify((rev ? [...chain].reverse() : chain).map(P), 0.003).map(U);
        if (rev) line.reverse();
        line[0] = at(chain[0]);
        out.push(...line.slice(0, -1));
      }
      a = b;
    } while (a !== start);
    out.push(out[0]);
    c.ring = out.map(([x, y]) => [+x.toFixed(5), +y.toFixed(5)]);
  }
}

// 路線ごとに別名の同じ駅(京王多摩センターと小田急多摩センターなど)は、会社名を外して1つにまとめる
export function groupStations(stations) {
  const groups = [];
  for (const s of stations) {
    const name = s.name.replace(/^(京王|小田急)(?=..)/, '');
    const g = groups.find((g) => g.name === name && Math.hypot(g.lat - s.lat, g.lon - s.lon) < 0.006);
    if (g) { g.pts.push(s); g.lat = g.pts.reduce((t, p) => t + p.lat, 0) / g.pts.length; g.lon = g.pts.reduce((t, p) => t + p.lon, 0) / g.pts.length; }
    else groups.push({ name, city: s.city, lat: s.lat, lon: s.lon, pts: [s] });
  }
  return groups.map(({ name, city, lat, lon, pts }) => ({ name, city, lat, lon, ids: pts.flatMap((p) => p.ids ?? []) }));
}
