// バス路線と電車の路線(停車駅の順番つき)を OpenStreetMap から取り、data/source/ に保存する。
// 閉じている間に通った場所を推測するデータ(build-route-data.mjs)が使う。
// 通信するのはこのスクリプトだけ。取り直すときだけ実行する(npm run route:fetch)
import { writeFileSync } from 'node:fs';

// 八王子市と周りの3市が入る四角(南・西・北・東)。area 指定は Overpass が失敗しやすいので四角で取る
const BBOX = '35.50,139.17,35.73,139.50';
const UA = { 'User-Agent': 'trip-gacha-map/0.1' };

async function overpass(query) {
  for (const url of ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']) {
    const res = await fetch(url, { method: 'POST', headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(query) });
    if (res.ok) return (await res.json()).elements;
  }
  throw new Error('Overpass に接続できません');
}

const fetched = new Date().toISOString().slice(0, 10);
const attribution = '© OpenStreetMap contributors (ODbL)';

// バス: 路線ごとに、通る道の線をつないだ形。道の向きは路線の順に並べ直さず、build-route-data.mjs がつなぐ
const bus = await overpass(`[out:json][timeout:180];relation["route"="bus"](${BBOX});out geom;`);
const busRoutes = bus.map((r) => ({
  id: r.id,
  name: r.tags.name ?? r.tags.ref ?? '',
  ways: r.members.filter((m) => m.type === 'way' && m.geometry && !/platform/.test(m.role)).map((m) => m.geometry.map((p) => [+p.lon.toFixed(5), +p.lat.toFixed(5)])),
})).filter((r) => r.ways.length > 0);
writeFileSync(new URL('../data/source/bus_routes.json', import.meta.url), JSON.stringify({ attribution, fetched, bbox: BBOX, routes: busRoutes }) + '\n');
console.log(`バス路線 ${busRoutes.length}本`);

// 電車: 路線ごとの停車駅(停車位置の点)の順番。ケーブルカー・モノレールも入れる
const rail = await overpass(`[out:json][timeout:180];relation["route"~"^(train|subway|light_rail|monorail|funicular)$"](${BBOX})->.r;.r out body;node(r.r:"stop");out;node(r.r:"stop_entry_only");out;node(r.r:"stop_exit_only");out;`);
const nodes = new Map(rail.filter((e) => e.type === 'node').map((n) => [n.id, n]));
const railRoutes = rail.filter((e) => e.type === 'relation').map((r) => ({
  id: r.id,
  name: r.tags.name ?? '',
  stops: r.members.filter((m) => m.type === 'node' && /^stop/.test(m.role) && nodes.has(m.ref))
    .map((m) => { const n = nodes.get(m.ref); return [+n.lon.toFixed(5), +n.lat.toFixed(5), n.tags?.name ?? '']; }),
})).filter((r) => r.stops.length >= 2);
writeFileSync(new URL('../data/source/rail_routes.json', import.meta.url), JSON.stringify({ attribution, fetched, bbox: BBOX, routes: railRoutes }) + '\n');
console.log(`電車の路線 ${railRoutes.length}本`);
