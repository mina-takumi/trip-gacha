// 八王子市の周りの市(町田市・多摩市・日野市)の形と駅を OpenStreetMap から取り、
// data/source/neighbors.json に保存する。簡略地図(build-map.mjs --neighbors)が使う。
// 通信するのはこのスクリプトだけ。取り直すときだけ実行する
import { writeFileSync } from 'node:fs';
import { haversineDistanceM } from '../src/geofence.ts';

const CITIES = ['町田市', '多摩市', '日野市'];
const UA = { 'User-Agent': 'trip-gacha-map/0.1' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function overpass(query) {
  for (const url of ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']) {
    const res = await fetch(url, { method: 'POST', headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(query) });
    if (res.ok) return (await res.json()).elements;
  }
  throw new Error('Overpass に接続できません');
}

// 形: Nominatim の間引かない輪郭。隣の市との境目は同じ点を共有するので、build-map.mjs が境目ごとに同じ形に間引ける。
// 飛び地があれば一番大きい輪だけ使う。八王子市の輪郭は、どこが八王子市との境目かを見分けるためだけに取る
async function outline(name) {
  const q = new URLSearchParams({ q: `東京都${name}`, format: 'json', polygon_geojson: '1', limit: '1' });
  const [hit] = await (await fetch(`https://nominatim.openstreetmap.org/search?${q}`, { headers: UA })).json();
  await sleep(1100); // Nominatim は1秒に1回まで
  const rings = hit.geojson.type === 'Polygon' ? [hit.geojson.coordinates[0]] : hit.geojson.coordinates.map((p) => p[0]);
  return { hit, ring: rings.sort((a, b) => b.length - a.length)[0] };
}

const hachioji = (await outline('八王子市')).ring;
const cities = [];
const stations = [];
for (const name of CITIES) {
  const { hit, ring } = await outline(name);
  cities.push({ name, osm: `relation/${hit.osm_id}`, ring });

  // 駅: 市の中にある railway=station。路線ごとに別々に登録されている同名の駅は、500m以内なら1つにまとめる
  const els = await overpass(`[out:json][timeout:120];area(id:${3600000000 + Number(hit.osm_id)})->.a;nwr["railway"="station"](area.a);out center tags;`);
  for (const e of els) {
    const lat = e.lat ?? e.center.lat, lon = e.lon ?? e.center.lon;
    const n = e.tags.name;
    if (!n) continue;
    const same = stations.find((s) => s.name === n && haversineDistanceM(s.lat, s.lon, lat, lon) < 500);
    // id は八王子市の停留所と同じ形(n123 / w123 / r123)。まとめた駅は一番小さい id を使う(カードの記録がこの id で残る)
    const id = e.type[0] + e.id;
    if (same) same.ids.push(id);
    else stations.push({ name: n, city: name, lat: +lat.toFixed(6), lon: +lon.toFixed(6), ids: [id] });
  }
}

const out = { attribution: '© OpenStreetMap contributors (ODbL)', fetched: new Date().toISOString().slice(0, 10), hachioji, cities, stations };
writeFileSync(new URL('../data/source/neighbors.json', import.meta.url), JSON.stringify(out) + '\n');
for (const c of cities) console.log(c.name, `輪郭${c.ring.length}点`, `駅${stations.filter((s) => s.city === c.name).length}`, stations.filter((s) => s.city === c.name).map((s) => s.name).join(' '));
