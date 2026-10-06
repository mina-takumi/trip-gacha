// 八王子市内の主な道路(高速・国道・主要地方道・県道)を OpenStreetMap から取り、
// data/source/hachioji_roads.json に保存する。簡略地図(build-map.mjs)が使う。
// 通信するのはこのスクリプトだけ。取り直すときだけ実行する
// --all を付けると住宅街の道・歩道まで取る(試し用)。--out <ファイル> で保存先を変えられる
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const KINDS = args.includes('--all')
  ? 'motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|service|pedestrian|footway|path|steps'
  : 'motorway|trunk|primary|secondary';
const outFile = args.includes('--out') ? resolve(args[args.indexOf('--out') + 1]) : new URL('../data/source/hachioji_roads.json', import.meta.url);

const AREA = 3605301639; // 八王子市の境界 relation 5301639 + 3600000000
const query = `[out:json][timeout:300];area(id:${AREA})->.a;way["highway"~"^(${KINDS})$"](area.a);out geom;`;

const res = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: { 'User-Agent': 'trip-gacha-map/0.1', 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'data=' + encodeURIComponent(query),
});
if (!res.ok) throw new Error(`Overpass ${res.status}`);
const { elements } = await res.json();

const roads = elements.map((w) => ({
  kind: w.tags.highway,
  name: w.tags.name ?? '',
  line: w.geometry.map((g) => [+g.lon.toFixed(5), +g.lat.toFixed(5)]),
}));

const out = {
  attribution: '© OpenStreetMap contributors (ODbL)',
  fetched: new Date().toISOString().slice(0, 10),
  query,
  roads,
};
writeFileSync(outFile,JSON.stringify(out) + '\n');
console.log(`道路 ${roads.length} 本、点 ${roads.reduce((n, r) => n + r.line.length, 0)} 個`);
