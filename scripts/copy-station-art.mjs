// 卒業制作フォルダの駅カードの絵を、英字の名前で public/art/special/ にコピーし、512×512 の WebP に縮める。
// ホーム画面のアイコンもここで作る。
// 実行: npm run art   (絵の置き場所を変えたときは: node scripts/copy-station-art.mjs <フォルダ>)
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createCatalog } from '../src/items.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const SRC = process.argv[2] ?? 'C:\\Users\\cazut\\Desktop\\大学\\卒業制作\\カード\\駅';
const OUT = join(root, 'public', 'art', 'special');
const ICONS = join(root, 'public', 'icons');

// ファイル名がカードの名前と違うもの
const FILE_OF = {
  '小宮の風車': '小宮の歯車.png', // ファイル名は歯車だが、中身は風車
  '中央大学・明星大学の竪琴': '中央大学・明星大学.png',
};
// まだ作り直し中で、名前の物が描かれていない絵。アプリでは仮の絵を出す
const PENDING = new Set(['八王子の指輪', '京王堀之内の印章']);

const { spots } = JSON.parse(readFileSync(join(root, 'data', 'spots.json'), 'utf8'));
const stations = Object.values(createCatalog(spots).stations);
mkdirSync(OUT, { recursive: true });
mkdirSync(ICONS, { recursive: true });

let copied = 0;
for (const st of stations) {
  const key = st.art.replace('special/', '');
  if (PENDING.has(st.name)) { console.log(`作り直し中のため飛ばす: ${st.name}`); continue; }
  const file = join(SRC, FILE_OF[st.name] ?? `${st.name}.png`);
  if (!existsSync(file)) { console.log(`見つからない: ${st.name}(${file})`); continue; }
  await sharp(file).resize(512, 512).webp({ quality: 82 }).toFile(join(OUT, `${key}.webp`));
  copied++;
}
console.log(`コピー: ${copied} / ${stations.length}枚 → public/art/special/`);

// アイコンは京王八王子の灯台の絵から作る
const iconSrc = join(SRC, '京王八王子の灯台.png');
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  await sharp(iconSrc).resize(size, size).png().toFile(join(ICONS, name));
}
console.log('アイコン: public/icons/(192・512・180)');
