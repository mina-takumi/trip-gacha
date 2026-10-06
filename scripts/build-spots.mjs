// 停留所CSVを整理して data/spots.json を作る。
// 実行: node scripts/build-spots.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { haversineDistanceM } from '../src/geofence.ts';

// 同名の停留所をまとめる距離。上り・下りの組は最大310m、別の場所にある同名は3.7km以上離れている。
const MERGE_RADIUS_M = 500;

const root = fileURLToPath(new URL('..', import.meta.url));
const SRC = root + 'data/source/hachioji_stops.csv';
const OUT = root + 'data/spots.json';

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.length > 1);
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

const idNumber = (id) => BigInt(id.slice(1));
const byId = (a, b) => (idNumber(a) < idNumber(b) ? -1 : idNumber(a) > idNumber(b) ? 1 : 0);
const round7 = (x) => Math.round(x * 1e7) / 1e7;

const raw = parseCsv(readFileSync(SRC, 'utf8')).map((r) => ({
  id: r.id, name: r.name, kind: r.kind, lat: Number(r.lat), lon: Number(r.lon),
}));

const unnamed = raw.filter((s) => s.name.startsWith('(名称なし'));
const named = raw.filter((s) => !s.name.startsWith('(名称なし'));

const groups = new Map();
for (const s of named) {
  const key = s.kind + '\u0000' + s.name;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(s);
}

// 同名グループの中で、500m以内でつながるものを1つのスポットにまとめる
function cluster(members) {
  const parent = members.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i], b = members[j];
      if (haversineDistanceM(a.lat, a.lon, b.lat, b.lon) <= MERGE_RADIUS_M) {
        parent[find(i)] = find(j);
      }
    }
  }
  const out = new Map();
  members.forEach((m, i) => {
    const r = find(i);
    if (!out.has(r)) out.set(r, []);
    out.get(r).push(m);
  });
  return [...out.values()];
}

const spots = [];
const keptApart = [];
for (const members of groups.values()) {
  const clusters = cluster(members);
  if (clusters.length > 1) keptApart.push({ name: members[0].name, kind: members[0].kind, count: clusters.length });
  for (const c of clusters) {
    const sourceIds = c.map((m) => m.id).sort(byId);
    spots.push({
      id: sourceIds[0],
      name: c[0].name,
      kind: c[0].kind,
      lat: round7(c.reduce((t, m) => t + m.lat, 0) / c.length),
      lon: round7(c.reduce((t, m) => t + m.lon, 0) / c.length),
      sourceIds,
    });
  }
}

const kindOrder = { station: 0, bus_stop: 1 };
spots.sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind] || byId(a.id, b.id));

writeFileSync(OUT, JSON.stringify({
  attribution: '© OpenStreetMap contributors (ODbL)',
  mergeRadiusM: MERGE_RADIUS_M,
  spots,
}, null, 1) + '\n');

const count = (kind) => spots.filter((s) => s.kind === kind).length;
console.log(`元データ: ${raw.length}行 / 名前なしで除外: ${unnamed.length}件`);
console.log(`スポット: 駅 ${count('station')} / バス停 ${count('bus_stop')} / 合計 ${spots.length}`);
console.log(`同名だが離れているため別スポットにしたもの: ${keptApart.length}組`);
for (const k of keptApart) console.log(`  ${k.name} (${k.kind}) → ${k.count}か所`);
console.log(`出力: data/spots.json`);
