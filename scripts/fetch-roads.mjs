// 八王子市内の主な道路(高速・国道・主要地方道・県道)を OpenStreetMap から取り、
// data/source/hachioji_roads.json に保存する。簡略地図(build-map.mjs)が使う。
// 通信するのはこのスクリプトだけ。取り直すときだけ実行する
// --all を付けると住宅街の道・歩道まで取る(試し用)。--out <ファイル> で保存先を変えられる
// --neighbors を付けると八王子市ではなく周りの市(data/source/neighbors.json の町田市・多摩市・日野市)の道路を取り、
// 各道路に city を付けて data/source/neighbors_roads.json(--all なら neighbors_roads_all.json)に保存する
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const KINDS = args.includes('--all')
  ? 'motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|service|pedestrian|footway|path|steps'
  : 'motorway|trunk|primary|secondary';
const neighbors = args.includes('--neighbors');
const defaultOut = neighbors ? `neighbors_roads${args.includes('--all') ? '_all' : ''}.json` : 'hachioji_roads.json';
const outFile = args.includes('--out') ? resolve(args[args.indexOf('--out') + 1]) : new URL(`../data/source/${defaultOut}`, import.meta.url);

// 境界 relation の番号 + 3600000000 が Overpass の area の番号
const areas = neighbors
  ? JSON.parse(readFileSync(new URL('../data/source/neighbors.json', import.meta.url), 'utf8')).cities
    .map((c) => ({ city: c.name, id: 3600000000 + Number(c.osm.split('/')[1]) }))
  : [{ city: '八王子市', id: 3605301639 }];

const queries = [];
const roads = [];
for (const { city, id } of areas) {
  const query = `[out:json][timeout:300];area(id:${id})->.a;way["highway"~"^(${KINDS})$"](area.a);out geom;`;
  queries.push(query);
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'User-Agent': 'trip-gacha-map/0.1', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query),
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const { elements } = await res.json();
  for (const w of elements) {
    roads.push({
      ...(neighbors && { city }),
      kind: w.tags.highway,
      name: w.tags.name ?? '',
      line: w.geometry.map((g) => [+g.lon.toFixed(5), +g.lat.toFixed(5)]),
    });
  }
}

const out = {
  attribution: '© OpenStreetMap contributors (ODbL)',
  fetched: new Date().toISOString().slice(0, 10),
  query: queries.length === 1 ? queries[0] : queries,
  roads,
};
writeFileSync(outFile,JSON.stringify(out) + '\n');
console.log(`道路 ${roads.length} 本、点 ${roads.reduce((n, r) => n + r.line.length, 0)} 個`);
