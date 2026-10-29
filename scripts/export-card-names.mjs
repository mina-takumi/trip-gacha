// src/items.ts が作るカードの名前を一覧(docs/)に書き出す。
// 書き出し: node scripts/export-card-names.mjs
// 確認:     node scripts/export-card-names.mjs --check  (一覧と今の名前が1文字でも違えば失敗する)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as Items from '../src/items.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const { spots } = JSON.parse(readFileSync(root + 'data/spots.json', 'utf8'));
const catalog = Items.createCatalog(spots);

const RARITY_LABEL = { SUPER_RARE: '超レア', RARE: 'レア', NORMAL: 'ふつう' };
const HEADER = [
  '<!-- このファイルは scripts/export-card-names.mjs が src/items.ts から自動で作る。手で編集しない。 -->',
  '<!-- 確認: node scripts/export-card-names.mjs --check -->',
  '',
];

function publicList() {
  const stations = Object.values(catalog.stations).map((s) => ({ ...s, station: spots.find((p) => p.id === s.spotId).name, city: spots.find((p) => p.id === s.spotId).city ?? '八王子市' }));
  return [
    ...HEADER,
    '# カードの名前一覧(確定版 v4)',
    '',
    '言葉のリストは v4 で確定(v2 で「角笛」を「鎌」に、v3 で「双子の」を「鎖の」に、v4 で「欠けた」「砕けた」「白い」を「稲妻の」「水晶の」「翠の」に変えた。駅カードの名前は v1 と同じ)。公開後に変えると、所持しているカードの名前が変わってしまう。',
    '',
    `## 駅カード(${stations.length}枚)`,
    '',
    '各駅にふつう・レア・超レアの3段階があり、名前は3段階とも同じ(枠が銅・銀・金になる)。2026-10-29 に日野市・町田市・多摩市の23駅(XXII〜XLIV)を足した。八王子市の22駅の名前と番号は変えていない。',
    '',
    '| 番号 | 名前 | 駅 | 市 |',
    '|---|---|---|---|',
    ...stations.map((s) => `| ${s.number} | ${s.name} | ${s.station} | ${s.city} |`),
    '',
    `## バス停カード(${catalog.common.length}枚)`,
    '',
    '| 番号 | 名前 | レア度 |',
    '|---|---|---|',
    ...catalog.common.map((c) => `| ${c.number} | ${c.name} | ${RARITY_LABEL[c.rarity]} |`),
    '',
  ].join('\n');
}

function secretList() {
  const bus = spots.filter((s) => s.kind === 'bus_stop');
  const nameAt = (s) => catalog.describe(catalog.secretAt(s.id)).name;
  const stopsOf = (noun) => bus.filter((s) => nameAt(s) === noun).length;
  return [
    ...HEADER,
    '# 裏アイテムの名前一覧(確定版 v5・非公開)',
    '',
    '存在を知らせない隠し要素なので、このファイルは公開しない(.gitignore で除外)。',
    '',
    'v5(2026-10-23)で、名前からバス停の名前を外し、物の名前だけにした。物ごとに1種(24種)で、どのバス停で出ても同じ物ならかぶり。どのバス停でどの物が出るかは v4 と同じ。',
    '',
    `## 裏アイテム(${Items.SPECIAL_NOUNS.length}種)`,
    '',
    '| 名前 | 出るバス停の数 |',
    '|---|---|',
    ...Items.SPECIAL_NOUNS.map((n) => `| ${n} | ${stopsOf(n)} |`),
    '',
    `## バス停ごとに出る裏アイテム(${bus.length}か所)`,
    '',
    '並びはスポット番号順。',
    '',
    '| バス停 | 裏アイテム |',
    '|---|---|',
    ...bus.map((s) => `| ${s.name} | ${nameAt(s)} |`),
    '',
  ].join('\n');
}

const files = [
  ['docs/card-names.md', publicList()],
  ['docs/card-names-secret.md', secretList()],
];

if (process.argv.includes('--check')) {
  let ok = true;
  for (const [path, text] of files) {
    const current = existsSync(root + path) ? readFileSync(root + path, 'utf8') : null;
    if (current === text) console.log(`一致: ${path}`);
    else { console.log(`不一致: ${path} — 名前が確定版から変わっている`); ok = false; }
  }
  process.exit(ok ? 0 : 1);
}

for (const [path, text] of files) writeFileSync(root + path, text);
console.log(`書き出し: ${files.map(([p]) => p).join(', ')}`);
