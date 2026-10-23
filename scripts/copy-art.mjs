// 卒業制作フォルダのカードの絵(ChatGPT で作ったもの)を、英字の名前で public/art/ にコピーし、512×512 の WebP に縮める。
// 駅カード → public/art/special/、バス停カード → public/art/bus/、裏カード → public/art/secret/。ホーム画面のアイコンもここで作る。
// 実行: npm run art   (絵の置き場所を変えたときは: node scripts/copy-art.mjs <駅のフォルダ> <バス停のフォルダ> <裏カードのフォルダ>)
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ART_KEYS, SPECIAL_NOUNS, createCatalog } from '../src/items.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const CARDS = 'C:/Users/cazut/Desktop/大学/卒業制作/カード';
const STATION_SRC = process.argv[2] ?? join(CARDS, 'GPT-駅');
const BUS_SRC = process.argv[3] ?? join(CARDS, 'GPT-バス');
const SECRET_SRC = process.argv[4] ?? join(CARDS, 'GPT-裏カード');
const ART = join(root, 'public', 'art');
const ICONS = join(root, 'public', 'icons');

const { spots } = JSON.parse(readFileSync(join(root, 'data', 'spots.json'), 'utf8'));
const catalog = createCatalog(spots);

/** ファイル名はカードの日本語名。art は 'special/lighthouse' のような出力先 */
async function copyAll(cards, srcDir) {
  let copied = 0;
  for (const card of cards) {
    const file = join(srcDir, `${card.name}.png`);
    if (!existsSync(file)) { console.log(`見つからない: ${card.name}(${file})`); continue; }
    const out = join(ART, `${card.art}.webp`);
    mkdirSync(join(out, '..'), { recursive: true });
    await sharp(file).resize(512, 512).webp({ quality: 82 }).toFile(out);
    copied++;
  }
  return copied;
}

const stations = Object.values(catalog.stations);
console.log(`駅: ${await copyAll(stations, STATION_SRC)} / ${stations.length}枚 → public/art/special/`);
console.log(`バス停: ${await copyAll(catalog.common, BUS_SRC)} / ${catalog.common.length}枚 → public/art/bus/`);
// 裏カードの絵は物ごとに1枚。ファイル名は物の名前(灯台.png など)
const secrets = SPECIAL_NOUNS.map((noun) => ({ name: noun, art: 'secret/' + ART_KEYS[noun] }));
console.log(`裏カード: ${await copyAll(secrets, SECRET_SRC)} / ${secrets.length}枚 → public/art/secret/`);

// アイコンは京王八王子の灯台の絵から作る
mkdirSync(ICONS, { recursive: true });
const iconSrc = join(STATION_SRC, '京王八王子の灯台.png');
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  await sharp(iconSrc).resize(size, size).png().toFile(join(ICONS, name));
}
console.log('アイコン: public/icons/(192・512・180)');
