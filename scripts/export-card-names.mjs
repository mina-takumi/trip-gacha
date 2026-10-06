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
  const stations = Object.values(catalog.stations).map((s) => ({ ...s, station: spots.find((p) => p.id === s.spotId).name }));
  return [
    ...HEADER,
    '# カードの名前一覧(確定版 v1)',
    '',
    '言葉のリストは v1 で確定。公開後に変えると、所持しているカードの名前が変わってしまう。',
    '',
    `## 駅カード(${stations.length}枚)`,
    '',
    '各駅にふつう・レア・超レアの3段階があり、名前は3段階とも同じ(枠が銅・銀・金になる)。',
    '',
    '| 番号 | 名前 | 駅 |',
    '|---|---|---|',
    ...stations.map((s) => `| ${s.number} | ${s.name} | ${s.station} |`),
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
  return [
    ...HEADER,
    '# 裏アイテムの名前一覧(確定版 v1・非公開)',
    '',
    '存在を知らせない隠し要素なので、このファイルは公開しない(.gitignore で除外)。',
    '',
    `バス停 ${bus.length}か所に1枚ずつ。並びはスポット番号順。`,
    '',
    '| バス停 | 裏アイテムの名前 |',
    '|---|---|',
    ...bus.map((s) => `| ${s.name} | ${catalog.describe('secret:' + s.id).name} |`),
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
