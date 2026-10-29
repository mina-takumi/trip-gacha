// カードの名前をルールで生成する。items.js を TypeScript に移したもの。
// 同じ itemId からは必ず同じ名前が出る(乱数・時刻を使わない)。
// 名前は確定版 v4(v2: 2026-10-07 「角笛」を「鎌」に。v3: 2026-10-08 「双子の」を「鎖の」に。v4: 2026-10-09 「欠けた」「砕けた」「白い」を「稲妻の」「水晶の」「翠の」に。どれも絵に描けなかったため)。言葉のリストを変えると所持カードの名前が変わる。変えていないことは
// node scripts/export-card-names.mjs --check で確かめる。
// 裏カードは確定版 v5(2026-10-23): バス停の名前を外し、物の名前だけに。物ごとに1種(24種)で、どのバス停で出ても同じ物ならかぶり。

export type Rarity = 'NORMAL' | 'RARE' | 'SUPER_RARE';
/** 裏カード(SECRET)も含めた珍しさ */
export type CardRarity = Rarity | 'SECRET';

export const MODIFIERS = [
  '銀の', '金の', '黒い', '翠の', '紅い', '蒼い',
  '稲妻の', '水晶の', '燃える', '凍てる', '逆さの', '鎖の',
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
// 周りの市の駅と物(2026-10-29 決定)。物は上の24語とも、バス停の物とも重ならない。
// 八王子の22駅の物と裏カードの割り当てを動かさないよう、決め方を使わず表で持つ
export const NEIGHBOR_CITIES = ['日野市', '町田市', '多摩市'];
export const NEIGHBOR_NOUNS: Record<string, string> = {
  '日野': '錠前', '豊田': '兜', '高幡不動': '弓', '百草園': '結晶', '多摩動物公園': '鳥籠', '程久保': '柱',
  '甲州街道': '気球', '万願寺': '風見鶏', '平山城址公園': '首飾り', '南平': '馬車',
  '町田': '斧', '相原': '玉座', '鶴川': '瓶', '玉川学園前': '宝箱', '成瀬': '神殿', 'すずかけ台': '傘',
  'つくし野': '城', '南町田グランベリーパーク': '壺', '多摩境': '盾',
  '多摩センター': '扇', '永山': '鏡', '聖蹟桜ヶ丘': '貝', '唐木田': '望遠鏡',
};
// 絵のファイル名に使う英字。カードの名前には影響しない
export const ART_KEYS: Record<string, string> = {
  '銀の': 'silver', '金の': 'gold', '黒い': 'black', '翠の': 'emerald', '紅い': 'crimson', '蒼い': 'azure',
  '稲妻の': 'lightning', '水晶の': 'crystal', '燃える': 'burning', '凍てる': 'frozen', '逆さの': 'inverted',
  '鎖の': 'chained', '夜明けの': 'dawn', '真夜中の': 'midnight', '翼ある': 'winged',
  '月': 'moon', '太陽': 'sun', '星': 'star', '鍵': 'key', '剣': 'sword', '杯': 'chalice', '杖': 'wand',
  '冠': 'crown', '扉': 'door', '天秤': 'scales', '砂時計': 'hourglass', '錨': 'anchor', '羽': 'feather',
  '目': 'eye', '炎': 'flame', '雫': 'droplet', '輪': 'wheel', '灯': 'lantern', '鐘': 'bell', '矢': 'arrow',
  '門': 'gate', '羅針盤': 'compass', '旗': 'banner', '灯台': 'lighthouse', '橋': 'bridge', '船': 'ship',
  '燭台': 'candlestick', '竪琴': 'harp', '書': 'book', '巻物': 'scroll', '松明': 'torch', '泉': 'fountain',
  '樹': 'tree', '山': 'mountain', '階段': 'staircase', '窓': 'window', '歯車': 'gear', '風車': 'windmill',
  '仮面': 'mask', '指輪': 'ring', '宝珠': 'orb', '印章': 'seal', '鎌': 'scythe', '天球儀': 'armillary',
  '鏡': 'mirror', '扇': 'fan', '盾': 'shield', '兜': 'helmet', '弓': 'bow', '玉座': 'throne', '宝箱': 'chest',
  '望遠鏡': 'telescope', '鳥籠': 'birdcage', '気球': 'balloon', '貝': 'shell', '結晶': 'snowflake', '錠前': 'padlock',
  '壺': 'urn', '瓶': 'bottle', '城': 'castle', '神殿': 'temple', '柱': 'column', '傘': 'umbrella',
  '首飾り': 'necklace', '斧': 'axe', '馬車': 'carriage', '風見鶏': 'weathervane',
};

export interface Spot {
  id: string;
  name: string;
  kind: string;
  lat: number;
  lon: number;
  /** 周りの市の駅だけ(日野市など)。八王子市のスポットには付かない */
  city?: string;
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
  rarity: CardRarity;
  name: string;
  noun: string;
  number: string | null;
  art: string;
}

// 絵のパス(拡張子なし)。バス停は物と修飾の組ごと、駅と裏は物ごとに1枚。
// 裏は駅と同じ物でも別の絵(紫と銀のステンドグラス風。2026-10-23)
const commonArt = (noun: string, modifier: string) => 'bus/' + ART_KEYS[noun] + '-' + ART_KEYS[modifier];
const specialArt = (noun: string) => 'special/' + ART_KEYS[noun];
const secretArt = (noun: string) => 'secret/' + ART_KEYS[noun];

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

// 駅: 八王子の22駅は、番号(0〜XXI)はスポット番号順、物はハッシュ順に、重ならないように割り当てる。
// 周りの市の駅は、その続き(XXII〜)に市の順・市の中はスポット番号順で並べ、物は NEIGHBOR_NOUNS の表から
function buildStations(spots: Spot[]): Record<string, StationCard> {
  const stations = spots.filter((s) => s.kind === 'station' && !s.city).slice().sort(idOrder);
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
  const cityOrder = (s: Spot) => NEIGHBOR_CITIES.indexOf(s.city!);
  spots.filter((s) => s.kind === 'station' && s.city)
    .sort((a, b) => cityOrder(a) - cityOrder(b) || idOrder(a, b))
    .forEach((s, i) => {
      const noun = NEIGHBOR_NOUNS[s.name];
      if (!noun) throw new Error('周りの市の駅の物が決まっていない: ' + s.name);
      out[s.id] = { spotId: s.id, name: s.name + 'の' + noun, noun, number: toRoman(stations.length + i), art: specialArt(noun) };
    });
  return out;
}

// バス停ごとに、出る裏カードの物が1つ決まっている。v4 まで名前が「バス停名の物」だったころの決め方のまま
// (名前と物で同じ字が重ならないように選ぶ)。変えると、どのバス停でどの裏カードが出るかが変わる
function secretNoun(spot: Spot): string {
  const start = hash('secret:' + spot.id);
  for (let k = 0; k < SPECIAL_NOUNS.length; k++) {
    const noun = SPECIAL_NOUNS[(start + k) % SPECIAL_NOUNS.length];
    if (!sharesChar(spot.name, noun)) return noun;
  }
  throw new Error('裏アイテムに割り当てられる物がない: ' + spot.name);
}

// 裏カードの itemId は物ごと(secret:lighthouse など)
const secretIdOf = (noun: string) => 'secret:' + ART_KEYS[noun];
const secretNounOf = new Map(SPECIAL_NOUNS.map((n) => [secretIdOf(n), n]));

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
      const noun = secretNounOf.get(itemId);
      return noun ? { itemId, rarity: 'SECRET', name: noun, noun, number: null, art: secretArt(noun) } : null;
    }
    return null;
  }

  /** そのバス停で出る裏カードの itemId */
  function secretAt(spotId: string): string {
    const spot = spotById.get(spotId);
    if (!spot) throw new Error('スポットがない: ' + spotId);
    return secretIdOf(secretNoun(spot));
  }

  return { common, stations, describe, secretAt };
}

export type Catalog = ReturnType<typeof createCatalog>;
