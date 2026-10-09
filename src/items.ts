// カードの名前をルールで生成する。items.js を TypeScript に移したもの。
// 同じ itemId からは必ず同じ名前が出る(乱数・時刻を使わない)。
// 名前は確定版 v3(v2: 2026-10-07 「角笛」を「鎌」に。v3: 2026-10-08 「双子の」を「鎖の」に。どちらも絵に描けなかったため)。言葉のリストを変えると所持カードの名前が変わる。変えていないことは
// node scripts/export-card-names.mjs --check で確かめる。

export type Rarity = 'NORMAL' | 'RARE' | 'SUPER_RARE';

export const MODIFIERS = [
  '銀の', '金の', '黒い', '白い', '紅い', '蒼い',
  '欠けた', '砕けた', '燃える', '凍てる', '逆さの', '鎖の',
  '夜明けの', '真夜中の', '翼ある',
];
export const NOUNS = [
  '月', '太陽', '星', '鍵', '剣', '杯', '杖', '冠', '扉', '天秤',
  '砂時計', '錨', '羽', '目', '炎', '雫', '輪', '灯', '鐘', '矢',
];
// 駅と裏アイテム専用。バス停のカードとは重ならない
export const SPECIAL_NOUNS = [
  '門', '羅針盤', '旗', '灯台', '橋', '船', '燭台', '竪琴', '書', '巻物', '松明', '泉',
  '樹', '山', '階段', '窓', '歯車', '風車', '仮面', '指輪', '宝珠', '印章', '鎌', '天球儀',
];
// 絵のファイル名に使う英字。カードの名前には影響しない
export const ART_KEYS: Record<string, string> = {
  '銀の': 'silver', '金の': 'gold', '黒い': 'black', '白い': 'white', '紅い': 'crimson', '蒼い': 'azure',
  '欠けた': 'chipped', '砕けた': 'cracked', '燃える': 'burning', '凍てる': 'frozen', '逆さの': 'inverted',
  '鎖の': 'chained', '夜明けの': 'dawn', '真夜中の': 'midnight', '翼ある': 'winged',
  '月': 'moon', '太陽': 'sun', '星': 'star', '鍵': 'key', '剣': 'sword', '杯': 'chalice', '杖': 'wand',
  '冠': 'crown', '扉': 'door', '天秤': 'scales', '砂時計': 'hourglass', '錨': 'anchor', '羽': 'feather',
  '目': 'eye', '炎': 'flame', '雫': 'droplet', '輪': 'wheel', '灯': 'lantern', '鐘': 'bell', '矢': 'arrow',
  '門': 'gate', '羅針盤': 'compass', '旗': 'banner', '灯台': 'lighthouse', '橋': 'bridge', '船': 'ship',
  '燭台': 'candlestick', '竪琴': 'harp', '書': 'book', '巻物': 'scroll', '松明': 'torch', '泉': 'fountain',
  '樹': 'tree', '山': 'mountain', '階段': 'staircase', '窓': 'window', '歯車': 'gear', '風車': 'windmill',
  '仮面': 'mask', '指輪': 'ring', '宝珠': 'orb', '印章': 'seal', '鎌': 'scythe', '天球儀': 'armillary',
};

export interface Spot {
  id: string;
  name: string;
  kind: string;
  lat: number;
  lon: number;
}

export interface CommonCard {
  itemId: string;
  rarity: Rarity;
  name: string;
  modifier: string;
  noun: string;
  number: string;
  art: string;
}

export interface StationCard {
  spotId: string;
  name: string;
  noun: string;
  number: string;
  art: string;
}

export interface CardInfo {
  itemId: string;
  rarity: Rarity | 'SECRET';
  name: string;
  noun: string;
  number: string | null;
  art: string;
}

// 絵のパス(拡張子なし)。バス停は物と修飾の組ごと、駅と裏は物ごとに1枚
const commonArt = (noun: string, modifier: string) => 'bus/' + ART_KEYS[noun] + '-' + ART_KEYS[modifier];
const specialArt = (noun: string) => 'special/' + ART_KEYS[noun];

// 意味が重なるため使わない組み合わせ
const EXCLUDED = new Set(['翼ある羽', '燃える炎', '鎖の輪']);
const MODIFIERS_PER_NOUN = 6;
const RARITY_COUNTS: [Rarity, number][] = [['SUPER_RARE', 15], ['RARE', 35], ['NORMAL', 70]];

export function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

const byHash = (prefix: string) => (a: { key: string }, b: { key: string }) =>
  hash(prefix + a.key) - hash(prefix + b.key) || (a.key < b.key ? -1 : 1);

export function toRoman(n: number): string {
  if (n === 0) return '0';
  const table: [number, string][] = [[100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of table) while (n >= v) { out += s; n -= v; }
  return out;
}

// 名詞 i には修飾語 6i, 6i+1, ... (mod 15) を順に割り当てる。各修飾語がほぼ均等(8回前後)に使われる
function buildCommon(): CommonCard[] {
  const combos: { key: string; modifier: string; noun: string }[] = [];
  NOUNS.forEach((noun, i) => {
    for (let k = MODIFIERS_PER_NOUN * i, taken = 0; taken < MODIFIERS_PER_NOUN; k++) {
      const modifier = MODIFIERS[k % MODIFIERS.length];
      if (EXCLUDED.has(modifier + noun)) continue;
      combos.push({ key: modifier + noun, modifier, noun });
      taken++;
    }
  });
  combos.sort(byHash('common:'));
  const cards: CommonCard[] = [];
  let pos = 0;
  for (const [rarity, count] of RARITY_COUNTS) {
    for (let k = 0; k < count; k++, pos++) {
      const c = combos[pos];
      cards.push({
        itemId: 'common:' + rarity + ':' + k, rarity, name: c.modifier + c.noun, modifier: c.modifier, noun: c.noun,
        number: toRoman(pos + 1), art: commonArt(c.noun, c.modifier),
      });
    }
  }
  return cards;
}

function idOrder(a: Spot, b: Spot): number {
  const x = BigInt(a.id.slice(1)), y = BigInt(b.id.slice(1));
  return x < y ? -1 : x > y ? 1 : 0;
}

// 「山田の山」のように、名前と物で同じ字が重なるのを防ぐ
function sharesChar(name: string, noun: string): boolean {
  for (const ch of noun) if (name.includes(ch)) return true;
  return false;
}

// 駅: 番号(0〜XXI)はスポット番号順、物はハッシュ順に、重ならないように割り当てる
function buildStations(spots: Spot[]): Record<string, StationCard> {
  const stations = spots.filter((s) => s.kind === 'station').slice().sort(idOrder);
  const used = new Set<string>();
  const nounOf: Record<string, string> = {};
  stations.map((s) => ({ key: s.id, spot: s }))
    .sort(byHash('station:'))
    .forEach((x) => {
      const noun = SPECIAL_NOUNS.filter((n) => !used.has(n) && !sharesChar(x.spot.name, n))[0];
      if (!noun) throw new Error('駅に割り当てられる物が足りない: ' + x.spot.name);
      used.add(noun);
      nounOf[x.spot.id] = noun;
    });
  const out: Record<string, StationCard> = {};
  stations.forEach((s, i) => {
    out[s.id] = { spotId: s.id, name: s.name + 'の' + nounOf[s.id], noun: nounOf[s.id], number: toRoman(i), art: specialArt(nounOf[s.id]) };
  });
  return out;
}

function secretName(spot: Spot): { name: string; noun: string } {
  const start = hash('secret:' + spot.id);
  for (let k = 0; k < SPECIAL_NOUNS.length; k++) {
    const noun = SPECIAL_NOUNS[(start + k) % SPECIAL_NOUNS.length];
    if (!sharesChar(spot.name, noun)) return { name: spot.name + 'の' + noun, noun };
  }
  throw new Error('裏アイテムに割り当てられる物がない: ' + spot.name);
}

export function createCatalog(spots: Spot[]) {
  const common = buildCommon();
  const commonById = new Map(common.map((c) => [c.itemId, c]));
  const stations = buildStations(spots);
  const spotById = new Map(spots.map((s) => [s.id, s]));

  function describe(itemId: string): CardInfo | null {
    const p = itemId.split(':');
    if (p[0] === 'common') return commonById.get(itemId) ?? null;
    if (p[0] === 'station') {
      const st = stations[p[1]];
      return st ? { itemId, rarity: p[2] as Rarity, name: st.name, noun: st.noun, number: st.number, art: st.art } : null;
    }
    if (p[0] === 'secret') {
      const spot = spotById.get(p[1]);
      if (!spot) return null;
      const sec = secretName(spot);
      return { itemId, rarity: 'SECRET', name: sec.name, noun: sec.noun, number: null, art: specialArt(sec.noun) };
    }
    return null;
  }

  return { common, stations, describe };
}

export type Catalog = ReturnType<typeof createCatalog>;
