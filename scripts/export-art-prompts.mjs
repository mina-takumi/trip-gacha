// SeaArt AI に渡すイラストの指示書(docs/illustration-prompts.md)と、ChatGPT に渡す裏カードの指示書
// (docs/illustration-prompts-secret.md。公開しない)を src/items.ts から書き出す。
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

// バス停カードの指示は短くする(2026-10-09)。長い指示(約130語)では後ろの言葉が効かず、
// 蒼い月を約60語にしたら月そのものが蒼くなった。画像生成AIが一度に読めるのは約75トークン
const BUS_LIMIT = 75;
// 後ろの放射状の線は、下に垂れる縦の線や円の飾りとして描かれたので入れない(2026-10-09 試し8枚)
// 短くしたら物が小さい・端に寄る・いくつも出るようになったので、構図の言葉を短く戻した(同)
const BUS_COMPOSITION = 'one single object only, centered, object fills most of the image';
const BUS_STYLE = 'art deco emblem, flat, symmetrical';
const BUS_NEGATIVE = 'text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center';
// もともと丸い物は、円の禁止で物まで消えないよう外す
const ROUND_NOUNS = ['太陽', '輪'];
const ROUND_WORDS = ['circular frame', 'halo ring'];

// 描かれなかった・別の物になった物は、形の分かる呼び方にする(2026-09-30〜10-08)
const BUS_SUBJECT = {
  '月': 'crescent moon',
  '目': 'open almond-shaped eye with a round iris',
  '扉': 'tall arched door with two panels',
  '雫': 'teardrop-shaped water droplet',
  '輪': 'spoked wagon wheel',
  '天秤': 'balance scale with exactly two hanging pans',
};
// [物の色, 物への修飾, 背景, 日本語の意味]
const MOD = {
  '銀の': ['silver', '', '', '物全体が銀色'],
  '金の': ['radiant bright gold', 'strong golden glow', '', '物がいつもより強く輝く金'],
  // silhouette は人の影絵として描かれた(2026-10-07)ので使わない
  '黒い': ['matte black', 'painted solid black with a thin gold edge', '', '黒く塗った物、ふちだけ金'],
  // 白い(2026-10-09 まで)は白い鍵が金のままで描けず、翠の に差し替えた
  '翠の': ['emerald green', '', '', '物全体が翠色'],
  '紅い': ['crimson red', '', '', '物全体が紅色'],
  '蒼い': ['azure blue', '', '', '物全体が蒼色'],
  // 欠けた・砕けた(物から減らす修飾)は何度直しても描けず、2026-10-09 に物へ足す修飾の 稲妻の・水晶の に差し替えた
  '稲妻の': ['', 'crackling with stylized lightning bolts around it', '', '稲妻が走る'],
  '水晶の': ['clear crystal', 'made of transparent faceted crystal', '', '透き通った水晶でできている'],
  '燃える': ['', 'burning, wreathed in stylized flames', '', '炎に包まれている'],
  '凍てる': ['', 'frozen, covered in frost crystals', '', '霜の結晶に覆われている'],
  '逆さの': ['', 'upside down', '', '上下逆さま'],
  '鎖の': ['', 'wrapped tightly in a heavy chain', '', '太い鎖が巻きつく'],
  '夜明けの': ['', '', 'very dark navy blue sky background, lower quarter glowing with orange sunrise', '背景の下4分の1が朝焼けの橙'],
  '真夜中の': ['', '', 'deep navy night sky background with many tiny white stars', '背景が濃紺の夜空、白く小さな星'],
  '翼ある': ['', 'with a pair of feathered wings', '', '翼が生えている'],
};
// 物全体の色を「全体がその色」と念押しする修飾。金の・黒いは物の色だけで足りる
const RECOLOR = ['銀の', '翠の', '紅い', '蒼い'];
const BUS_PLAIN_BACKGROUND = 'very dark navy blue background, almost black, solid flat color';

// そのカードだけの禁止。共通の禁止より前に置く(後ろほど効きにくいため)
const MOD_NEGATIVE = {
  '黒い': (noun) => [`golden ${noun}`, 'person', 'human figure', 'hood', 'cloak'],
  '夜明けの': () => ['orange object'],
  '真夜中の': () => ['brown background', 'orange background'],
  '水晶の': (noun) => [`golden ${noun}`],
  ...Object.fromEntries(RECOLOR.map((m) => [m, (noun) => [`golden ${noun}`]])),
};
// 蒼い月の1枚目(2026-10-09)で出た、クレーター・垂れる線・星
const NOUN_NEGATIVE = { '月': ['craters', 'dripping', 'stars'] };

const busNegativeFor = (card) => {
  const noun = NOUN_EN[card.noun];
  const own = [
    ...(MOD_NEGATIVE[card.modifier]?.(noun) || []),
    ...(NOUN_NEGATIVE[card.noun] || []).filter((w) => !(w === 'stars' && card.modifier === '真夜中の')),
  ];
  const common = BUS_NEGATIVE.split(', ').filter((w) => !(ROUND_NOUNS.includes(card.noun) && ROUND_WORDS.includes(w)));
  // 共通の「バス停カード用」と同じなら、カードの下には書かない
  if (!own.length && common.length === BUS_NEGATIVE.split(', ').length) return undefined;
  return [...own, ...common].join(', ');
};

// 物の名前は最初の1回だけ書く。何度も書くと、その物を複数描く(2026-10-09 鍵が3本・4本出た)
function commonPrompt(card) {
  const noun = NOUN_EN[card.noun];
  const [color, objectMod, bgMod] = MOD[card.modifier];
  const subject = `single ${color || 'warm muted gold'} ${BUS_SUBJECT[card.noun] || noun}`;
  return [
    subject,
    'the main subject, large and clearly recognizable',
    BUS_COMPOSITION,
    RECOLOR.includes(card.modifier) ? `entirely ${color}` : '',
    objectMod,
    BUS_STYLE,
    // 真夜中の星は、背景の stars でも星の名前が2回になるので、光の点と書く
    (card.noun === '星' ? bgMod.replace('tiny white stars', 'tiny white dots of light') : bgMod) || BUS_PLAIN_BACKGROUND,
    'subtle glow',
  ].filter(Boolean).join(', ');
}

// 単語とカンマの数。トークン数のおおよその目安
const roughTokens = (text) => (text.match(/[A-Za-z]+|\d+|,/g) || []).length;

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
const commonEntry = (c) => entry(`${c.number} ${c.name}`, c.art, commonPrompt(c), `${c.noun}(${MOD[c.modifier][3]})`, busNegativeFor(c));

const stations = Object.values(catalog.stations);
const specials = Items.SPECIAL_NOUNS.map((noun) => {
  const st = stations.find((s) => s.noun === noun);
  return { noun, title: st ? `${st.number} ${st.name}` : `特別カード(${noun})`, file: 'special/' + Items.ART_KEYS[noun] };
});
const specialEntry = (s) => entry(s.title, s.file, specialPrompt(s.noun), `${s.noun}(特別カード。装飾多め・後ろに光の輪)`,
  EMPHASIS[s.noun] ? negativeFor(s.noun) : undefined);

const trials = ['蒼い月', '燃える鍵'].map((name) => catalog.common.find((c) => c.name === name));
const trialSpecial = specials.find((s) => s.noun === '灯台');
// 指示を短くした後(2026-10-09)、120枚を作る前に試すカード。修飾の種類ごとに1枚
const busTrials = ['黒い冠', '稲妻の錨', '水晶の鍵', '夜明けの炎', '真夜中の星', '鎖の剣', '燃える鍵', '翠の鍵']
  .map((name) => catalog.common.find((c) => c.name === name));

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
  '| 塗り | 特別カードは輪郭線だけの指示(実際は金で塗られた絵になった)。バス停カードは平らな塗りでよい |',
  '| 色の修飾 | 銀・白・紅・蒼は物全体をその色にする |',
  '| 背景 | ほぼ黒に近い無地の濃紺。模様や質感は付けない(「夜明けの」「真夜中の」のカードだけ背景が変わる) |',
  '| 構図 | 真正面から見た形で中央に。物は大きく |',
  '| バス停カード | 物が主役で1つだけ。後ろの飾りは描かない(放射状の線は縦の線や円になった)。指示文は短く(約75語以内)。長いと後ろに書いた言葉が効かない |',
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
  '特別カード用より短くしたもの。このカードだけの禁止があるカードは、各カードの下に先頭へ足した文を書いてある。',
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
  `指示文が長すぎて後ろの言葉が効いていなかったため、バス停カードの指示を短くした(2026-10-09)。作ってあったバス停カードもすべてこの指示で作り直す。120枚を作る前に、修飾の種類ごとに1枚ずつ、この${busTrials.length}枚で試す。`,
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
const over = catalog.common.flatMap((c) => [['プロンプト', commonPrompt(c)], ['禁止', busNegativeFor(c) || BUS_NEGATIVE]]
  .map(([kind, text]) => [c.name, kind, roughTokens(text)]).filter(([, , n]) => n > BUS_LIMIT));
const longest = Math.max(...catalog.common.flatMap((c) => [commonPrompt(c), busNegativeFor(c) || BUS_NEGATIVE].map(roughTokens)));
console.log(`バス停カードの指示の長さ: 最長 ${longest}(目安 ${BUS_LIMIT} 以内)`);
for (const [name, kind, n] of over) console.log(`  長すぎ: ${name} の${kind} ${n}`);
console.log(`書き出し: docs/illustration-prompts.md(特別 ${specials.length}枚 + バス停 ${catalog.common.length}枚 = ${specials.length + catalog.common.length}枚)`);

// ---------- 裏カード(ChatGPT 用) ----------
// 裏カードは存在を知らせないので、別のファイルに書き出して公開しない(.gitignore)。
// 絵柄は駅カードと見分けるため、紫と銀のステンドグラス風(2026-10-23、灯台・天球儀・船の3枚で決定)。
// ChatGPT は文章で書いた指示をよく守るので、SeaArt のような単語の並びではなく文で書く

// [物の説明, 「the ◯◯ is built from」の◯◯, 向き, 左右対称か, そのカードだけ足す文]
// 灯台・天球儀・船は試しで作った3枚と1文字も変えない
const FRONT = 'Shown from the front, centered';
const SECRET_SUBJECT = {
  '門': ['ornate gate: two tall pillars with a pair of closed iron gate doors between them, under an arch', 'gate', FRONT, true],
  '羅針盤': ['compass: a round navigation compass with a needle pointing north', 'compass', 'Seen from directly above, centered', true],
  '旗': ['banner flag: a waving flag hanging from a tall vertical pole', 'flag', 'Centered', false],
  '灯台': ['lighthouse: a tall tower with a lantern room at the top, with beams of light shining out to both sides', 'lighthouse', FRONT, true],
  '橋': ['stone arch bridge with one large arch spanning from left to right', 'bridge', 'Seen from the side, centered', true, 'No river, no landscape.'],
  '船': ['sailing ship with full sails, seen from the side', 'ship', 'Centered', false, 'No sea, no waves.'],
  '燭台': ['candlestick holding one lit candle', 'candlestick', FRONT, true],
  '竪琴': ['harp: a tall frame harp with many strings', 'harp', 'Seen from the side, centered', false],
  '書': ['open book with its pages spread to both sides', 'book', FRONT, true, 'The pages are blank, with no writing.'],
  '巻物': ['scroll: a long sheet of paper partly unrolled, with a wooden roller at each end', 'scroll', FRONT, true, 'The paper is blank, with no writing.'],
  '松明': ['torch: a wooden handle standing upright with a burning flame at the top', 'torch', FRONT, true],
  '泉': ['fountain: a round stone basin on a pedestal with water spraying up from the center', 'fountain', FRONT, true],
  '樹': ['tree with a thick trunk, spreading branches and a round leafy crown', 'tree', FRONT, true, 'No ground, no landscape.'],
  '山': ['mountain: one large triangular peak with a snow cap', 'mountain', FRONT, true, 'Only one peak, no landscape.'],
  '階段': ['staircase: a straight flight of steps rising upward', 'staircase', FRONT, true],
  '窓': ['arched window with a frame divided into small panes, standing on its own', 'window', FRONT, true, 'No building or wall around the window.'],
  '歯車': ['gear: a cogwheel with teeth around its edge and a hole in the center', 'gear', FRONT, true],
  '風車': ['windmill: a tower with four large cross-shaped sails', 'windmill', FRONT, true, 'No ground, no landscape.'],
  '仮面': ['masquerade mask that covers the eyes, with two empty eye holes, floating on its own', 'mask', FRONT, true, 'No face behind the mask.'],
  '指輪': ['ring: a ring band with one large faceted gem set on top', 'ring', FRONT, true],
  '宝珠': ['orb: a round sphere with a band around its middle and a small cross on top', 'orb', FRONT, true],
  '印章': ['ink stamp: a short wooden handle on top and a square stamp block at the bottom with an engraved flat face', 'stamp', FRONT, true],
  '鎌': ['scythe: a long straight wooden pole standing vertically with a large curved blade at the top, the blade sweeping out to one side', 'scythe', 'Centered', false, 'No skull, no hooded figure.'],
  '天球儀': ['armillary sphere: several crossing rings forming a sphere around a small globe in the center, on a short stand', 'armillary sphere', FRONT, true],
};
// 試しで作り、そのまま本番に使う3枚(2026-10-23)
const SECRET_DONE = ['灯台', '天球儀', '船'];
// 窓は物そのものが窓なので、「窓の形で囲まない」の禁止を外す
const SECRET_NO_FRAME = 'No card frame or border, no circle or window shape around the object, no arched church window.';
const SECRET_NO_FRAME_WINDOW = 'No card frame or border, no circle around the object.';

function secretPrompt(noun) {
  const [desc, short, view, symmetrical, extra] = SECRET_SUBJECT[noun];
  return [
    `Square image. A single ${desc}. ${view}, filling about 60 to 70 percent of the image.`,
    `Stained glass style: the ${short} is built from flat pieces of colored glass in shades of violet, amethyst purple and pale lavender, separated by bold silver lead lines of even medium thickness.`,
    'A few small silver sparkles around it.',
    'Plain, solid, very deep purple background, almost black, with no pattern or texture.',
    ...(extra ? [extra] : []),
    `${symmetrical ? 'Symmetrical, simple' : 'Simple'} and bold, so it still reads clearly when shown small on a phone.`,
    'Only one object. No text, letters or numbers.',
    noun === '窓' ? SECRET_NO_FRAME_WINDOW : SECRET_NO_FRAME,
    'No people or hands. No gold. Not photorealistic, not 3D.',
  ].join(' ');
}

const missing = Items.SPECIAL_NOUNS.filter((n) => !SECRET_SUBJECT[n]);
if (missing.length) throw new Error('裏カードの物の説明がない: ' + missing.join('、'));
const secretEntry = (noun) => [
  `### ${noun}${SECRET_DONE.includes(noun) ? '(作成済み)' : ''}`, '',
  `保存する名前: \`${noun}.png\` / アプリでの名前: \`art/secret/${Items.ART_KEYS[noun]}\``, '', block(secretPrompt(noun)), '',
];
const todo = Items.SPECIAL_NOUNS.filter((n) => !SECRET_DONE.includes(n));
const secretLines = [
  '<!-- このファイルは scripts/export-art-prompts.mjs が src/items.ts から自動で作る。手で編集しない。 -->',
  '',
  '# 裏カードの絵の指示書(ChatGPT 用)',
  '',
  `裏カードの真ん中の図柄 ${Items.SPECIAL_NOUNS.length}枚ぶんの指示。物ごとに1枚で、同じ物の裏カードどうしは同じ絵になる。裏カードは存在を知らせないので、このファイルは公開しない(\`.gitignore\` で外している)。`,
  '',
  '## 絵柄の決まりごと(2026-10-23 決定)',
  '',
  '| 項目 | 決まりごと |',
  '|---|---|',
  '| 様式 | ステンドグラス風。物を平らな色ガラスのかけらで組み、かけらの間を銀の線で区切る |',
  '| 色 | 紫・アメジスト色・薄いラベンダー。金は使わない(駅カードと見分けるため) |',
  '| 背景 | ほぼ黒に近い、無地の濃い紫 |',
  '| 構図 | 物は1つだけ、真ん中に大きく(画面の6〜7割) |',
  '| 描かないもの | 文字・数字、カードの枠、物を囲む丸や窓の形、人や手(窓のカードだけ「窓の形」の禁止を外している) |',
  '',
  '灯台・天球儀・船の3枚で試し、駅カードと別のシリーズに見えること、3枚がそろうこと、図鑑の大きさでも物が分かることを確かめた。',
  '',
  '## 使い方',
  '',
  '1. ChatGPT に、枠の中の英文を1枚ずつそのまま貼る。共通の部分は変えない(変えると絵柄がそろわなくなる)',
  '2. 正方形で作られているか確かめる',
  '3. `C:\\Users\\cazut\\Desktop\\大学\\卒業制作\\カード\\GPT-裏\\` に、書いてある日本語の名前で保存する',
  '',
  `## まだ作っていないカード(${todo.length}枚)`,
  '',
  ...todo.flatMap(secretEntry),
  `## 作成済みのカード(${SECRET_DONE.length}枚)`,
  '',
  ...SECRET_DONE.flatMap(secretEntry),
];
writeFileSync(root + 'docs/illustration-prompts-secret.md', secretLines.join('\n'));
console.log(`書き出し: docs/illustration-prompts-secret.md(裏カード ${Items.SPECIAL_NOUNS.length}枚。まだ作っていない ${todo.length}枚)`);
