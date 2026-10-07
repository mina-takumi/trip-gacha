// SeaArt AI に渡すイラストの指示書(docs/illustration-prompts.md)を src/items.ts から書き出す。
// 実行: node scripts/export-art-prompts.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as Items from '../src/items.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const { spots } = JSON.parse(readFileSync(root + 'data/spots.json', 'utf8'));
const catalog = Items.createCatalog(spots);

const GOLD = 'warm muted gold';
const STYLE = 'art deco emblem, single icon illustration, FILL, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, BACKGROUND, subtle glow, generous empty margin, original design';
const PLAIN_BACKGROUND = 'very dark navy blue background, almost black, solid flat color';
const OUTLINE_ONLY = 'outline drawing only, no color fill';
const withBackground = (bg, fill = OUTLINE_ONLY) => STYLE.replace('BACKGROUND', bg || PLAIN_BACKGROUND).replace('FILL', fill);
// バス停カードの飾り。1回目(2026-09-30)は「thin circle」の円が主役になり、物が小さくなるか消えたため円を外した
const COMMON_STYLE = 'very few subtle short radiating lines behind the object, minimal ornament';
const SPECIAL_STYLE = 'ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo';
const NEGATIVE = 'text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed';

const NOUN_EN = {
  '月': 'moon', '太陽': 'sun', '星': 'star', '鍵': 'antique key', '剣': 'sword', '杯': 'chalice', '杖': 'magic staff',
  '冠': 'crown', '扉': 'arched door', '天秤': 'balance scales', '砂時計': 'hourglass', '錨': 'anchor', '羽': 'feather',
  '目': 'eye', '炎': 'flame', '雫': 'water droplet', '輪': 'wheel', '灯': 'lantern', '鐘': 'bell', '矢': 'arrow',
  '門': 'ornate gate', '羅針盤': 'compass', '旗': 'banner flag', '灯台': 'lighthouse', '橋': 'arched bridge',
  '船': 'sailing ship', '燭台': 'candlestick with a candle', '竪琴': 'harp', '書': 'open book', '巻物': 'scroll',
  '松明': 'torch', '泉': 'fountain', '樹': 'tree', '山': 'mountain', '階段': 'staircase', '窓': 'arched window',
  '歯車': 'gear', '風車': 'windmill', '仮面': 'mask', '指輪': 'diamond ring', '宝珠': 'orb', '印章': 'ink stamp',
  '鎌': 'scythe', '天球儀': 'armillary sphere',
};

// 試作で飾りに飲み込まれて物が描かれなかった特別カード(2026-09-29)。物の形を具体的に書き、主役であることを明記する
const EMPHASIS = {
  '山': 'a single large triangular mountain peak with a snow cap and clear slopes',
  '風車': 'a traditional windmill tower with four large cross-shaped sails',
  '階段': 'a straight flight of stone steps rising upward, seen from the front',
  '樹': 'a single large tree with a thick trunk, spreading branches and a round leafy crown',
  // 角笛・印章・指輪は2回目も描けず(2026-09-29)、縦に長く輪郭のはっきりした形として書き直した。
  // 前回の bell(鐘が描かれた)・round wax seal(丸い飾りに溶けた)・finger(手が描かれた)は使わない。
  // 4回目(2026-10-07)は、形のたとえに使った言葉がそのまま描かれた(chess piece → チェスの駒、wind instrument → 金管楽器、
  // standing upright → 立っている人)。別の物の名前や人を思わせる言葉を使わず、物そのものだけで書く
  // 角笛は4回作っても描けず、2026-10-07 に物を鎌(長い柄の大鎌)へ差し替えた。死神を思わせるので人やフードは禁止に足す
  '鎌': 'a long straight wooden pole standing vertically with a large curved steel blade attached at the top, the blade sweeping out to one side, a small grip in the middle of the pole',
  '橋': 'a stone arch bridge with one large arch spanning from left to right',
  '旗': 'a waving banner flag hanging from a tall vertical pole',
  '印章': 'an old ink stamp tool, a short wooden handle on top and a square stamp block at the bottom with an engraved flat face',
  '指輪': 'a piece of jewelry, a plain gold ring band with one large faceted diamond set on top',
};
// 上の9枚だけに足す「描いてほしくないこと」。共通の欄に足すと羅針盤など他のカードまで描けなくなる
const EMPHASIS_NEGATIVE = 'compass rose, sun disc, clock hands, empty medallion, abstract ornament only';
// 共通の禁止のうち、主役そのものを打ち消してしまう言葉(旗 = banner)
const NEGATIVE_EXCEPT = { '旗': ['title banner'] };
// そのカードだけにさらに足す禁止。試作で主役の代わりに描かれた物
// 4回目で写実的な光沢の絵になったので、3枚とも光沢も禁止する
const REDO_GLOSS = ['glossy', 'shiny reflections', 'realistic metal'];
const NEGATIVE_EXTRA = {
  '指輪': ['hand', 'fingers', 'person', 'human figure', 'silhouette', 'cloak', 'hood', ...REDO_GLOSS],
  '印章': ['chess piece', 'chess king', 'crown', ...REDO_GLOSS],
  '鎌': ['person', 'human figure', 'grim reaper', 'skeleton', 'skull', 'hood', 'cloak', 'hand', 'crescent moon', 'sickle', ...REDO_GLOSS],
};
const negativeFor = (noun) => [NEGATIVE.split(', ').filter((w) => !(NEGATIVE_EXCEPT[noun] || []).includes(w)).join(', '), EMPHASIS_NEGATIVE, ...(NEGATIVE_EXTRA[noun] || [])].join(', ');
// 指示書の「作り直すカード」の欄に並べるもの
const REDO = ['鎌', '印章', '指輪'];

// バス停カードのうち、描かれなかった・別の物になった物の形(2026-09-30)
const BUS_SHAPE = {
  '月': 'a large crescent moon shape',
  '目': 'an open eye with an almond shaped outline and a round iris',
  '扉': 'a tall arched door with two panels and a round handle',
  '雫': 'a teardrop shape, round at the bottom and pointed at the top',
  '輪': 'a spoked wagon wheel with a hub and a rim',
};
// バス停カードだけに足す禁止。共通の禁止(NEGATIVE)は特別カードと同じまま
const BUS_NEGATIVE = [NEGATIVE, 'circular frame, empty medallion, compass rose, tiny object, small object, object off center'].join(', ');

// 物の線だけ色を変え、飾りは金のまま残す修飾。線ごと色を変えると金のカードと別のシリーズに見えた(2026-09-30)
const TINTED = ['銀の', '金の', '白い', '紅い', '蒼い'];
// [線の色, 物への修飾, 背景への修飾, 日本語の意味]
const MOD = {
  '銀の': ['silver lines', '', '', '物を銀色に(飾りは金のまま)'],
  '金の': ['radiant bright gold lines with a strong golden glow', '', '', '物がいつもより強く輝く金'],
  '黒い': [`${GOLD} outline`, 'solid black silhouette', '', '黒く塗った影絵、ふちだけ金'],
  '白い': ['pure white lines', '', '', '物を白に(飾りは金のまま)'],
  '紅い': ['crimson red lines', '', '', '物を紅色に(飾りは金のまま)'],
  '蒼い': ['azure blue lines', '', '', '物を蒼色に(飾りは金のまま)'],
  '欠けた': [`${GOLD} lines`, 'chipped, a piece missing', '', '一部が欠けている'],
  '砕けた': [`${GOLD} lines`, 'cracked, fine fracture lines', '', 'ひびが入っている'],
  '燃える': [`${GOLD} lines`, 'burning, wreathed in stylized flames', '', '炎に包まれている'],
  '凍てる': [`${GOLD} lines`, 'frozen, covered in frost crystals', '', '霜の結晶に覆われている'],
  '逆さの': [`${GOLD} lines`, 'upside down', '', '上下逆さま'],
  '双子の': [`${GOLD} lines`, '', '', '同じものが2つ並ぶ'],
  '夜明けの': [`${GOLD} lines`, '', 'very dark navy blue background, a narrow band of warm dawn orange glow only along the bottom edge', '背景の下の端だけ朝焼けの橙'],
  '真夜中の': [`${GOLD} lines`, '', 'near-black midnight navy background, tiny scattered stars', '背景が暗い真夜中、小さな星'],
  '翼ある': [`${GOLD} lines`, 'with a pair of feathered wings', '', '翼が生えている'],
};

function commonPrompt(card) {
  const noun = NOUN_EN[card.noun];
  const [color, objectMod, bgMod] = MOD[card.modifier];
  const twin = card.modifier === '双子の';
  const subject = [twin ? `exactly two identical ${noun}, a pair side by side, only two` : 'single ' + noun, BUS_SHAPE[card.noun], objectMod].filter(Boolean).join(', ');
  const main = twin
    ? `the two ${noun} are the main subject, large and clearly recognizable`
    : `the ${noun} is the main subject, large and clearly recognizable`;
  const lines = TINTED.includes(card.modifier) ? [`the ${noun} drawn in ${color}`, `ornament in ${GOLD} lines`] : [color];
  const fill = card.modifier === '黒い' ? 'filled black silhouette with outline only' : undefined;
  return [subject, main, ...lines, COMMON_STYLE, withBackground(bgMod, fill)].join(', ');
}

function specialPrompt(noun) {
  const emphasis = EMPHASIS[noun]
    ? [EMPHASIS[noun], `the ${NOUN_EN[noun]} is the main subject, large and clearly recognizable, in front of the ornament`]
    : [];
  return ['single ' + NOUN_EN[noun], ...emphasis, `${GOLD} lines`, SPECIAL_STYLE, withBackground()].join(', ');
}

const block = (text) => ['```', text, '```'].join('\n');
const entry = (title, file, prompt, meaning, negative) => [
  `### ${title}`, '', `保存するファイル名: \`art/${file}.png\` / 意味: ${meaning}`, '', block(prompt), '',
  ...(negative ? ['このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。', '', block(negative), ''] : []),
];
const commonEntry = (c) => entry(`${c.number} ${c.name}`, c.art, commonPrompt(c), `${c.noun}(${MOD[c.modifier][3]})`);

const stations = Object.values(catalog.stations);
const specials = Items.SPECIAL_NOUNS.map((noun) => {
  const st = stations.find((s) => s.noun === noun);
  return { noun, title: st ? `${st.number} ${st.name}` : `特別カード(${noun})`, file: 'special/' + Items.ART_KEYS[noun] };
});
const specialEntry = (s) => entry(s.title, s.file, specialPrompt(s.noun), `${s.noun}(特別カード。装飾多め・後ろに光の輪)`,
  EMPHASIS[s.noun] ? negativeFor(s.noun) : undefined);

const trials = ['蒼い月', '燃える鍵'].map((name) => catalog.common.find((c) => c.name === name));
const trialSpecial = specials.find((s) => s.noun === '灯台');
// バス停カードの指示を直した後(2026-09-30)、残りを作る前に試すカード。1回目で描けなかったもの
const busTrials = ['紅い目', '蒼い扉', '金の月', '双子の剣', '夜明けの炎', '白い鍵'].map((name) => catalog.common.find((c) => c.name === name));

const lines = [
  '<!-- このファイルは scripts/export-art-prompts.mjs が src/items.ts から自動で作る。手で編集しない。 -->',
  '',
  '# イラスト指示書(SeaArt AI 用)',
  '',
  `カードの真ん中の図柄 ${catalog.common.length + specials.length}枚ぶんの指示。枠・ローマ数字・名前はアプリ側で描くので、絵には入れない。`,
  '',
  '## 使い方',
  '',
  '1. **モデルを選ぶ**: 下の「まず試す3枚」を、候補のモデル2〜3個で作ってみて、3枚の絵柄が一番そろうモデルに決める',
  '2. **モデルの利用条件を確かめる**: モデルごとに、作った絵の公開や利用についての条件が決まっている。将来ほかの人に配る予定なので、公開してよいモデルか必ず確かめる',
  '3. **設定を記録する**: 決めたモデルと設定を下の「記録欄」に書く。全カードを同じモデル・同じ設定で作る。途中で日が空いても、ここを見て同じ条件で再開する',
  '4. **画像の大きさは必ず正方形(1024 × 1024)にする**: 縦長にすると、AIがタロットカード1枚の形を思い浮かべ、枠・番号・名前の帯まで描いてしまう',
  '5. **1枚ずつ作る**: 各カードの枠の中の英文を「プロンプト」欄に、「描いてほしくないこと」を「ネガティブプロンプト」欄に貼る',
  '6. **保存する**: 書いてあるファイル名で保存し、このフォルダの `art/bus/` か `art/special/` に置く',
  '',
  '共通の指示の部分(各英文の後半)は1文字も変えないこと。変えると絵柄がそろわなくなる。',
  '',
  '## 絵柄の決まりごと',
  '',
  '| 項目 | 決まりごと |',
  '|---|---|',
  '| 様式 | アール・デコ風。直線・円・放射状の線の幾何学的な飾り、左右対称 |',
  '| 線 | 落ち着いた金。太さは中くらいでそろえる(スマホで小さく表示しても消えないように)。陰影は付けない |',
  '| 塗り | 輪郭線だけで描き、色は塗らない(「黒い」のカードだけ黒い影絵にする) |',
  '| 色の修飾 | 銀・白・紅・蒼は物の線だけその色にし、後ろの飾りは金のまま(シリーズとしてそろえるため) |',
  '| 背景 | ほぼ黒に近い無地の濃紺。模様や質感は付けない(「夜明けの」「真夜中の」のカードだけ背景が変わる) |',
  '| 構図 | 真正面から見た形で中央に。物は画面の6〜7割 |',
  '| バス停カード | 物が主役。後ろの飾りは短い放射状の線を少しだけで、円は描かない |',
  '| 特別カード | 太陽光線のような放射状の飾り・階段状の模様・かすかな光の輪。バス停カードより豪華にして特別感を出す |',
  '| 金の修飾 | 「金の」カードだけ、物をいつもの落ち着いた金ではなく強く輝く金にする |',
  '',
  '## 記録欄',
  '',
  '| 項目 | 値 |',
  '|---|---|',
  '| モデル名 | |',
  '| モデルの利用条件を確認した日 | |',
  '| 画像の大きさ | 1024 × 1024(正方形) |',
  '| サンプラー | |',
  '| ステップ数 | |',
  '| CFG | |',
  '| シード | (1つの値に固定して全カード同じにする) |',
  '',
  '## 描いてほしくないこと(ネガティブプロンプト欄に貼る)',
  '',
  '### 特別カード用',
  '',
  block(NEGATIVE),
  '',
  '### バス停カード用',
  '',
  '特別カード用の文に、円の飾りや小さすぎる物を防ぐ言葉を足したもの。',
  '',
  block(BUS_NEGATIVE),
  '',
  '## まず試す3枚',
  '',
  '色の修飾・効果の修飾・特別カードを1枚ずつ。この3枚が並べて同じシリーズに見えるモデルを選ぶ。',
  '',
  ...trials.flatMap(commonEntry),
  ...specialEntry(trialSpecial),
  `## バス停カードの試し(${busTrials.length}枚)`,
  '',
  'バス停カードの指示を直したので、残りを作る前にこの6枚で試す。1回目で物が描かれなかった・小さすぎた・数が違ったカード。うまくいったら、今までに作ったバス停カードも含めて全部この指示で作る。',
  '',
  ...busTrials.flatMap(commonEntry),
  `## 作り直すカード(${REDO.length}枚)`,
  '',
  '何度作っても名前の物が描かれなかったカード。4回目は、形のたとえに使った物(チェスの駒・金管楽器・立っている人)が描かれたため、たとえを外して物そのものだけで説明し直し、描かれた物を「描いてほしくないこと」に足している。角笛は描けなかったため、物を鎌(長い柄の大鎌)に差し替えた。下の特別カードの一覧にも同じ内容が入っている。',
  '',
  ...specials.filter((s) => REDO.includes(s.noun)).flatMap(specialEntry),
  `## 特別カード(${specials.length}枚)`,
  '',
  '装飾を少し増やし、後ろにかすかな光の輪を描く。',
  '',
  ...specials.flatMap(specialEntry),
  `## バス停カード(${catalog.common.length}枚)`,
  '',
  ...catalog.common.flatMap(commonEntry),
];

writeFileSync(root + 'docs/illustration-prompts.md', lines.join('\n'));
console.log(`書き出し: docs/illustration-prompts.md(特別 ${specials.length}枚 + バス停 ${catalog.common.length}枚 = ${specials.length + catalog.common.length}枚)`);
