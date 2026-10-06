// 八王子の簡略地図(レトロ版)を SVG で描き、見本の HTML に埋め込む。
// 入力: data/source/hachioji_boundary.json, data/source/hachioji_roads.json, data/spots.json
// 出力: mockups/map-v1-retro.html
// --roads <ファイル> で道路データを、--out <ファイル> で出力先を差し替えられる(試し用)
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? resolve(args[args.indexOf(name) + 1]) : null);
const root = new URL('../', import.meta.url);
const boundary = JSON.parse(readFileSync(new URL('data/source/hachioji_boundary.json', root), 'utf8'));
const { roads } = JSON.parse(readFileSync(opt('--roads') ?? new URL('data/source/hachioji_roads.json', root), 'utf8'));
const { spots } = JSON.parse(readFileSync(new URL('data/spots.json', root), 'utf8'));

const C = { cream: '#F4EDE0', panel: '#FBF6EC', orange: '#E8552F', mustard: '#F2B233', teal: '#2FA9A0', navy: '#22303C' };

// 緯度経度 → 画面の座標。経度は cos(緯度) で縮めて縦横比を合わせる
const W = 1200, PAD = 48;
const lons = boundary.ring.map((p) => p[0]), lats = boundary.ring.map((p) => p[1]);
const minLon = Math.min(...lons), maxLon = Math.max(...lons), minLat = Math.min(...lats), maxLat = Math.max(...lats);
const kx = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
const scale = (W - PAD * 2) / ((maxLon - minLon) * kx);
const H = Math.round((maxLat - minLat) * scale + PAD * 2);
const xy = (lon, lat) => [PAD + (lon - minLon) * kx * scale, PAD + (maxLat - lat) * scale];
const f = (n) => n.toFixed(1);

const station = Object.fromEntries(spots.filter((s) => s.kind === 'station').map((s) => [s.name, s]));
const busStops = spots.filter((s) => s.kind === 'bus_stop');

// 市の外の隣の駅(線を境界の外まで少し伸ばすためだけに使う)
const OUTSIDE = {
  豊田: [139.3818, 35.6595],
  相模湖方面: [139.2160, 35.6385],
  相原: [139.3317, 35.6066],
  拝島: [139.3439, 35.7213],
  平山城址公園: [139.3826, 35.6466],
  京王多摩センター: [139.4243, 35.6249],
  多摩境: [139.3657, 35.6031],
  多摩動物公園: [139.4040, 35.6486],
  多摩センター: [139.4239, 35.6248],
};

const LINES = [
  { name: 'JR中央線', color: C.orange, stops: ['相模湖方面', '高尾', '西八王子', '八王子', '豊田'] },
  { name: 'JR横浜線', color: C.mustard, stops: ['八王子', '片倉', '八王子みなみ野', '相原'] },
  { name: 'JR八高線', color: C.navy, stops: ['八王子', '北八王子', '小宮', '拝島'] },
  { name: '京王線', color: C.teal, stops: ['京王八王子', '北野', '長沼', '平山城址公園'] },
  { name: '京王高尾線', color: C.teal, stops: ['北野', '京王片倉', '山田', 'めじろ台', '狭間', '高尾', '高尾山口'] },
  { name: '京王相模原線', color: C.teal, stops: ['多摩境', '南大沢', '京王堀之内', '京王多摩センター'] },
  { name: '多摩モノレール', color: C.navy, dash: '2 9', stops: ['多摩動物公園', '中央大学・明星大学', '大塚・帝京大学', '松が谷', '多摩センター'] },
  { name: '高尾山ケーブルカー', color: C.navy, dash: '1 6', thin: true, stops: ['清滝', '高尾山'] },
];

const at = (name) => (station[name] ? xy(station[name].lon, station[name].lat) : xy(...OUTSIDE[name]));

// 駅名の置き場所。[文字の基準点のずれx, y, 揃え]。書いていない駅は右
const LABEL = {
  八王子: [-10, -12, 'end'],
  京王八王子: [8, -16, 'start'],
  西八王子: [0, -18, 'middle'],
  北野: [0, -16, 'middle'],
  長沼: [0, 26, 'middle'],
  京王片倉: [-4, -12, 'end'],
  片倉: [12, 16, 'start'],
  山田: [0, 28, 'middle'],
  めじろ台: [0, 28, 'middle'],
  狭間: [0, -16, 'middle'],
  高尾: [-14, -12, 'end'],
  高尾山口: [12, 20, 'start'],
  清滝: [0, 26, 'middle'],
  高尾山: [-12, 6, 'end'],
  八王子みなみ野: [-12, 6, 'end'],
  北八王子: [-12, 6, 'end'],
  小宮: [-12, 6, 'end'],
  中央大学・明星大学: [-10, -14, 'end'],
  大塚・帝京大学: [-12, 6, 'end'],
  松が谷: [12, 6, 'start'],
  南大沢: [-12, -8, 'end'],
  京王堀之内: [10, 22, 'start'],
};
const BIG = new Set(['八王子', '京王八王子', '高尾']);

const ring = boundary.ring.map(([lon, lat]) => xy(lon, lat));
const cityPath = 'M' + ring.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z';

// 市の外の駅へ向かう線は、境界を越えたところ(STUB px 先)で止める
const STUB = 22;
function cutAtBorder(inside, outside) {
  const [ax, ay] = inside, [bx, by] = outside;
  let best = null;
  for (let i = 0; i < ring.length - 1; i++) {
    const [cx, cy] = ring[i], [dx, dy] = ring[i + 1];
    const den = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
    if (!den) continue;
    const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / den;
    const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / den;
    if (t > 0 && t <= 1 && u >= 0 && u <= 1 && (best === null || t < best)) best = t;
  }
  if (best === null) return outside;
  const len = Math.hypot(bx - ax, by - ay);
  const t = Math.min(1, best + STUB / len);
  return [ax + (bx - ax) * t, ay + (by - ay) * t];
}

const lineSvg = LINES.map((l) => {
  const p = l.stops.map(at);
  const n = p.length;
  if (OUTSIDE[l.stops[0]]) p[0] = cutAtBorder(p[1], p[0]);
  if (OUTSIDE[l.stops[n - 1]]) p[n - 1] = cutAtBorder(p[n - 2], p[n - 1]);
  const pts = p.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
  const w = l.thin ? 3 : 6;
  if (l.dash) return `<polyline points="${pts}" stroke="${l.color}" stroke-width="${w}" stroke-dasharray="${l.dash}"/>`;
  return `<polyline points="${pts}" stroke="${C.navy}" stroke-width="${w + 4}"/><polyline points="${pts}" stroke="${l.color}" stroke-width="${w}"/>`;
}).join('\n');

// 道路。線の点を間引いて(ずれ1px以内)軽くし、市の形で切り抜く
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
    if (d > max) { max = d; idx = i; }
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}
const roadPath = (kinds) => roads.filter((r) => kinds.includes(r.kind))
  .map((r) => 'M' + simplify(r.line.map(([lon, lat]) => xy(lon, lat)), 1).map(([x, y]) => `${f(x)} ${f(y)}`).join('L')).join('');
const bigRoads = roadPath(['motorway', 'trunk']);
const midRoads = roadPath(['primary']);
const smallRoads = roadPath(['secondary']);
const tinyRoads = roadPath(['tertiary', 'unclassified', 'residential', 'living_street', 'service', 'pedestrian', 'footway', 'path', 'steps']);
// 太い道は「紺の縁+中を白抜き」の二重線、県道は細い1本線。重なりで濃くならないよう、まとめて薄める
const roadSvg = `<g clip-path="url(#city)" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".5">
${tinyRoads ? `<path d="${tinyRoads}" stroke="${C.navy}" stroke-width=".5" opacity=".6"/>` : ''}
<path d="${smallRoads}" stroke="${C.navy}" stroke-width="1.3"/>
<path d="${midRoads}" stroke="${C.navy}" stroke-width="4.5"/>
<path d="${bigRoads}" stroke="${C.navy}" stroke-width="6.5"/>
<path d="${midRoads}" stroke="${C.panel}" stroke-width="2"/>
<path d="${bigRoads}" stroke="${C.panel}" stroke-width="3.5"/>
</g>`;

const busSvg = busStops.map((s) => {
  const [x, y] = xy(s.lon, s.lat);
  return `<circle cx="${f(x)}" cy="${f(y)}" r="2.2"/>`;
}).join('');

const stationSvg = Object.values(station).map((s) => {
  const [x, y] = xy(s.lon, s.lat);
  const r = BIG.has(s.name) ? 9 : 6.5;
  const [dx, dy, anchor] = LABEL[s.name] ?? [12, 6, 'start'];
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" class="st"/>` +
    `<text x="${f(x + dx)}" y="${f(y + dy)}" text-anchor="${anchor}" class="lb${BIG.has(s.name) ? ' big' : ''}">${s.name}</text>`;
}).join('\n');

const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="八王子市の簡略地図">
<path d="${cityPath}" transform="translate(8 8)" fill="${C.navy}" stroke="${C.navy}" stroke-width="3" stroke-linejoin="round"/>
<clipPath id="city"><path d="${cityPath}"/></clipPath>
<path d="${cityPath}" fill="${C.panel}"/>
${roadSvg}
<path d="${cityPath}" fill="none" stroke="${C.navy}" stroke-width="3" stroke-linejoin="round"/>
<g fill="${C.mustard}" opacity=".75">${busSvg}</g>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
${lineSvg}
</g>
<g>
${stationSvg}
</g>
</svg>`;

const legend = [
  ['JR中央線', C.orange], ['JR横浜線', C.mustard], ['JR八高線', C.navy], ['京王線', C.teal],
  ['多摩モノレール', C.navy, true], ['高尾山ケーブルカー', C.navy, true],
].map(([n, c, dash]) => `<li><i style="background:${c}"${dash ? ' class="dash"' : ''}></i>${n}</li>`).join('');

const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.13  0 0 0 0 0.19  0 0 0 0 0.24  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.22'/></svg>")`;

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>八王子 簡略地図</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Yusei+Magic&family=Zen+Maru+Gothic:wght@700;900&display=swap" rel="stylesheet">
<!-- scripts/build-map.mjs が生成。手で編集しない -->
<style>
  :root { --cream: ${C.cream}; --panel: ${C.panel}; --orange: ${C.orange}; --mustard: ${C.mustard}; --teal: ${C.teal}; --navy: ${C.navy};
    --hand: "Yusei Magic", sans-serif; --maru: "Zen Maru Gothic", sans-serif; }
  * { box-sizing: border-box; margin: 0; }
  body { background: var(--cream); color: var(--navy); font-family: var(--maru); font-weight: 700; min-height: 100vh; }
  body::after { content: ""; position: fixed; inset: 0; background: ${grain}; mix-blend-mode: multiply; pointer-events: none; }
  .bar4 { display: flex; height: 10px; } .bar4 i { flex: 1; }
  main { max-width: 1240px; margin: 0 auto; padding: 28px 16px 40px; }
  h1 { font: 400 clamp(40px, 7vw, 72px)/1 var(--hand); text-shadow: 4px 4px 0 rgba(232, 85, 47, .55); }
  .map { margin-top: 20px; }
  .map svg { display: block; width: 100%; height: auto; }
  .st { fill: var(--cream); stroke: var(--navy); stroke-width: 2.5; }
  .lb { font: 700 15px var(--maru); fill: var(--navy); paint-order: stroke; stroke: var(--panel); stroke-width: 5px; stroke-linejoin: round; }
  .lb.big { font-size: 19px; font-weight: 900; }
  .legend { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 10px 18px; list-style: none; padding: 14px 18px;
    background: var(--panel); border: 2px solid var(--navy); border-radius: 22px; box-shadow: 4px 4px 0 var(--navy); font-size: 14px; }
  .legend li { display: flex; align-items: center; gap: 8px; }
  .legend i { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--navy); }
  .legend i.dash { background: var(--cream) !important; border-style: dashed; }
  .legend i.road { width: 24px; height: 9px; border-radius: 5px; background: var(--panel); opacity: .6; }
  .legend i.bus { width: 10px; height: 10px; border: 0; background: var(--mustard); }
  footer { margin-top: 14px; font-size: 12px; opacity: .7; }
</style>
</head>
<body>
<div class="bar4"><i style="background:var(--orange)"></i><i style="background:var(--mustard)"></i><i style="background:var(--teal)"></i><i style="background:var(--navy)"></i></div>
<main>
  <h1>はちおうじ</h1>
  <div class="map">
${svg}
  </div>
  <ul class="legend">${legend}<li><i class="road"></i>主な道路</li><li><i class="bus"></i>バス停</li></ul>
  <footer>&copy; OpenStreetMap contributors (ODbL)</footer>
</main>
</body>
</html>
`;

writeFileSync(opt('--out') ?? new URL('mockups/map-v1-retro.html', root), html);
console.log(`${opt('--out') ?? 'mockups/map-v1-retro.html'}  ${W}x${H}  駅${Object.keys(station).length} バス停${busStops.length}`);
