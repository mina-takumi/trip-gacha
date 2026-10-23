import { CONFIG, RARITIES, RARITY_LABEL } from '../config.ts';
import type { Odds } from '../gacha.ts';
import { stationItemId } from '../gacha.ts';
import type { CommonCard, Rarity, Spot, StationCard } from '../items.ts';
import type { GpsMode } from '../location.ts';
import type { SaveData } from '../store.ts';
import { cardHtml, placeholderHtml, type CardFace } from './card.ts';
import { distanceLabel, esc, km } from './html.ts';
import { icon } from './icons.ts';

export type Tab = 'main' | 'zukan' | 'map' | 'settings';
export type GeoStatus = 'starting' | 'denied' | 'unavailable' | 'waiting-accuracy' | 'ok';

const pct = (bp: number) => (bp / 100).toFixed(0);
const MAX_M = (CONFIG.bonusMaxBp / CONFIG.bonusPerStepBp) * CONFIG.bonusStepM;
const STEPS = MAX_M / CONFIG.bonusStepM;

export function tabbar(tab: Tab): string {
  const tabs: [Tab, string, string, string][] = [
    ['main', 'ホーム', 'home', 'o'], ['zukan', '図鑑', 'book', 'm'], ['map', '地図', 'pin', 't'], ['settings', '設定', 'gear', 'n'],
  ];
  return tabs.map(([t, label, ic, color]) =>
    `<button class="tab ${t === tab ? 'on' : ''}" data-act="tab" data-tab="${t}" aria-current="${t === tab ? 'page' : 'false'}"><span class="ic ${color}">${icon(ic)}</span>${label}</button>`).join('');
}

/** 回す権利がある駅・バス停。badge は駅ならカードの番号、バス停なら「バス」。distanceM は現在地が分からなければ null */
export interface NearSpot { spot: Spot; badge: string; distanceM: number | null; remainingMs: number }

export interface MainView {
  distanceM: number;
  odds: Odds;
  busOdds: Odds;
  nextStepM: number | null;
  shards: number;
  geo: GeoStatus;
  accuracyM: number | null;
  near: NearSpot[];
  nearest: { spot: Spot; distanceM: number } | null;
  storageOk: boolean;
}

function geoNotice(v: MainView): string {
  switch (v.geo) {
    case 'starting':
      return `<div class="notice panel"><b>現在地を、さがしています。</b>位置情報の確認が出たら「許可」を選んでください。</div>`;
    case 'denied':
      return `<div class="notice panel warn"><b>位置情報が、オフ。</b>駅やバス停の近くにいるかを調べるのに使います。ブラウザの設定で、このページに位置情報の利用を許可してから開き直してください。iPhone では「設定」アプリの「プライバシーとセキュリティ」→「位置情報サービス」で、Safari の位置情報がオンになっているかも確かめてください。</div>`;
    case 'unavailable':
      return `<div class="notice panel warn"><b>現在地が、取れない。</b>空の見える場所で少し待つか、アプリを開き直してください。</div>`;
    case 'waiting-accuracy':
      return `<div class="notice panel"><b>位置の精度を、待っています。</b>今の誤差は約${Math.round(v.accuracyM ?? 0)}m。${CONFIG.accuracyLimitM}m以内になるまで、駅・バス停の判定に使いません。</div>`;
    case 'ok':
      return '';
  }
}

export function mainScreen(v: MainView): string {
  const done = Math.floor(Math.min(v.distanceM, MAX_M) / CONFIG.bonusStepM);
  const feet = Array.from({ length: STEPS }, (_, i) => `<svg class="${i < done ? 'on' : 'off'}" viewBox="0 0 21 30" aria-hidden="true"><use href="#i-foot"/></svg>`).join('');
  const caption = v.nextStepM == null
    ? '<span class="mark">運は、もう最大。</span>'
    : `あと<span class="mark o">${Math.ceil(v.nextStepM)}m</span>で、運がひとつ上がる。`;
  // 1か所を1行に。回せる場所を上に、待ち時間中の場所は下に薄くまとめる
  const row = (n: NearSpot) => {
    const ready = n.remainingMs <= 0;
    const right = ready
      ? `<button class="spin-btn" data-act="spin" data-spot="${esc(n.spot.id)}">${icon('capsule')}回す</button>`
      : `<span class="wait-t">あと${Math.ceil(n.remainingMs / 60000)}分</span>`;
    return `<div class="spot ${ready ? '' : 'waiting'}"><span class="no${n.spot.kind === 'bus_stop' ? ' bus' : ''}">${esc(n.badge)}</span><span class="name">${esc(n.spot.name)}</span><span class="d">${n.distanceM == null ? '' : distanceLabel(n.distanceM)}</span>${right}</div>`;
  };
  const ready = v.near.filter((n) => n.remainingMs <= 0);
  const waiting = v.near.filter((n) => n.remainingMs > 0);
  // 今日もらった権利は、位置が取れていなくても使える
  const list = v.near.length > 0
    ? `<div class="sec"><span>回せる場所</span>${icon('gachapon', 'deco')}</div>
      ${ready.length > 0 ? `<div class="spots panel">${ready.map(row).join('')}</div>` : ''}
      ${waiting.length > 0 ? `<div class="spots wait-list">${waiting.map(row).join('')}</div><p class="wait-say">少し、寄り道を。</p>` : ''}`
    : '';
  const empty = v.geo === 'ok' && v.near.length === 0
    ? `<p class="say">近くに駅・バス停なし。${v.nearest ? `${esc(v.nearest.spot.name)}まで、あと${distanceLabel(v.nearest.distanceM)}。` : ''}</p>`
    : '';
  // 確率は小さな表1つ。横が珍しさ、縦が駅・バス停。スーパーレアの列だけ色を付ける
  const cell = (odds: Odds, r: Rarity) => `<b class="${r === 'SUPER_RARE' ? 'sr' : ''}">${pct(odds[r])}<small>%</small></b>`;
  const oddsTable = `<div class="odds-t panel" role="table" aria-label="今の確率">
    <span></span>${RARITIES.map((r) => `<span class="oh ${r === 'SUPER_RARE' ? 'sr' : ''}"><i class="dot ${r}"></i>${RARITY_LABEL[r]}</span>`).join('')}
    <span class="ok">駅</span>${RARITIES.map((r) => cell(v.odds, r)).join('')}
    <span class="ok">バス停</span>${RARITIES.map((r) => cell(v.busOdds, r)).join('')}
  </div>`;
  return `
    ${v.storageOk ? '' : '<div class="notice panel warn"><b>記録が、残せません。</b>このブラウザでは端末に記録を保存できないため、閉じると集めたカードが消えます。プライベートブラウズなら、通常のモードで開いてください。</div>'}
    <div class="top"><span class="logo">トリップガチャ</span><span class="top-r"><button class="reload" data-act="reload" aria-label="最新版に更新">${icon('reload')}<span class="reload-t">更新</span></button><span class="shard"><span class="ic">${icon('shard')}</span>かけら ${v.shards}</span></span></div>
    <div class="lead">今日、歩いた。</div>
    <div class="huge">${km(v.distanceM)}<small>km</small></div>
    <div class="feet" role="img" aria-label="${km(MAX_M)}kmまでのうち${km(v.distanceM)}km">${feet}</div>
    <div class="feet-cap">${caption}</div>
    ${oddsTable}
    ${geoNotice(v)}
    ${list}${empty}`;
}

export function resultScreen(card: CardFace, rarity: Rarity, tint: boolean, isNew: boolean, shardsGained: number, totalShards: number): string {
  const label = RARITY_LABEL[rarity].replace('スーパー', 'スーパー<br>');
  return `<div class="res-wrap"><div class="res">
    <div class="stamp ${rarity}"><span>${label}</span></div>
    <h2>出た。</h2>
    <div class="sub">${isNew
      ? '<span class="mark o">はじめての1枚。</span>図鑑に入りました。'
      : `もう持ってた。<span class="mark o">かけら +${shardsGained}</span>(合計 ${totalShards})。`}</div>
    <div class="rays">${cardHtml(card, rarity, 'big', tint)}</div>
    <div class="acts">
      <button class="btn mustard" data-act="result-zukan">${icon('book')}図鑑で見る</button>
      <button class="btn cream" data-act="result-back">ホームに戻る</button>
    </div>
  </div></div>`;
}

const ownedRarities = (collection: SaveData['collection'], spotId: string) => RARITIES.filter((r) => collection[stationItemId(spotId, r)]);
const ox = (have: Rarity[]) => RARITIES.map((r) => have.includes(r) ? '<span class="o">○</span>' : '<span class="x">×</span>').join('');

export type ZukanTab = 'station' | 'bus';

const zukanLead = (owned: number, total: number, where: string) =>
  owned === total ? '<span class="mark">ぜんぶ、集めた。</span>' : owned === 0 ? `${where}の近くで、回してみる。` : '<span class="mark">まだ、たくさんある。</span>';

export function zukanScreen(
  tab: ZukanTab, stations: Spot[], cards: Record<string, StationCard>, common: CommonCard[], collection: SaveData['collection'],
): string {
  const stTotal = stations.length * RARITIES.length;
  const stOwned = stations.reduce((n, s) => n + ownedRarities(collection, s.id).length, 0);
  const busOwned = common.filter((c) => collection[c.itemId]).length;
  const [owned, total] = tab === 'station' ? [stOwned, stTotal] : [busOwned, common.length];
  const tabBtn = (t: ZukanTab, label: string, n: number, of: number) =>
    `<button class="z-tab" data-act="zukan-tab" data-z="${t}" aria-pressed="${t === tab}">${label}<small>${n} / ${of}</small></button>`;
  return `<div class="z-top"><h2>図鑑</h2><div class="count">${owned}<small> / ${total}枚</small></div></div>
    <div class="z-tabs">${tabBtn('station', '駅', stOwned, stTotal)}${tabBtn('bus', 'バス停', busOwned, common.length)}</div>
    ${tab === 'station' ? stationTiles(stations, cards, collection, stOwned, stTotal) : busTiles(common, collection, busOwned)}`;
}

function stationTiles(stations: Spot[], cards: Record<string, StationCard>, collection: SaveData['collection'], owned: number, total: number): string {
  const tiles = stations.map((s) => {
    const have = ownedRarities(collection, s.id);
    const best = have[have.length - 1];
    return `<button class="tile ${best ? '' : 'none'}" data-act="detail" data-spot="${esc(s.id)}" aria-label="${esc(s.name)}">
      ${best ? cardHtml(cards[s.id], best, 'sm') : placeholderHtml(cards[s.id].number)}
      <div class="sn">${esc(s.name)}</div>
      <div class="ox" aria-label="${have.map((r) => RARITY_LABEL[r]).join('・') || 'まだなし'}">${ox(have)}</div>
    </button>`;
  }).join('');
  return `<div class="z-lead">${stations.length}駅 × 3段階。${zukanLead(owned, total, '駅')}</div>
    <div class="grid">${tiles}</div>`;
}

/** バス停カードは番号順に4列。持っていないカードも、珍しさだけは見せる */
function busTiles(common: CommonCard[], collection: SaveData['collection'], owned: number): string {
  const tiles = common.map((c) => {
    const entry = collection[c.itemId];
    return `<button class="tile ${entry ? '' : 'none'}" data-act="detail" data-item="${esc(c.itemId)}" aria-label="${entry ? esc(c.name) : `${esc(c.number)} まだなし`}">
      ${entry ? cardHtml(c, c.rarity, 'sm', false) + `<div class="sn">${esc(c.name)}</div>` : placeholderHtml(c.number)}
      <div class="ox"><span class="rl"><i class="dot ${c.rarity}"></i>${RARITY_LABEL[c.rarity]}</span></div>
    </button>`;
  }).join('');
  return `<div class="z-lead">どのバス停でも出る${common.length}枚。${zukanLead(owned, common.length, 'バス停')}</div>
    <div class="grid grid4">${tiles}</div>`;
}

export function busDetailScreen(card: CommonCard, collection: SaveData['collection']): string {
  const entry = collection[card.itemId];
  return `<div class="detail">
    <h2>${entry ? esc(card.name) : `${esc(card.number)} まだなし`}</h2>
    ${entry ? cardHtml(card, card.rarity, 'big', false) : `<div class="big">${placeholderHtml(card.number)}</div>`}
    <p class="say" style="text-align:center"><i class="dot ${card.rarity}"></i>${RARITY_LABEL[card.rarity]}。${entry ? `${entry.count}枚、持っている。` : 'バス停で、回す。'}</p>
    <div class="acts"><button class="btn paper" data-act="close-detail">図鑑に戻る</button></div>
  </div>`;
}

export function detailScreen(spot: Spot, card: StationCard, collection: SaveData['collection']): string {
  const have = ownedRarities(collection, spot.id);
  const best = have[have.length - 1];
  const trio = RARITIES.map((r) => {
    const entry = collection[stationItemId(spot.id, r)];
    return `<div>${entry ? cardHtml(card, r, 'sm') : placeholderHtml(card.number)}<div class="lbl">${RARITY_LABEL[r]}<br>${entry ? `<span class="o">○</span> ${entry.count}枚` : '<span class="x">×</span>'}</div></div>`;
  }).join('');
  return `<div class="detail">
    <h2>${best ? esc(card.name) : `${esc(spot.name)}駅`}</h2>
    ${best ? cardHtml(card, best, 'big') : `<div class="big">${placeholderHtml(card.number)}</div>`}
    ${best ? '' : `<p class="say" style="text-align:center">${esc(spot.name)}駅の近くで、回す。</p>`}
    <div class="trio">${trio}</div>
    <div class="acts"><button class="btn paper" data-act="close-detail">図鑑に戻る</button></div>
  </div>`;
}

const GPS_MODES: [GpsMode, string, string][] = [
  ['slow', `${CONFIG.gpsSlowIntervalMs / 1000}秒ごと`, `時速${CONFIG.gpsMediumKmh}km未満`],
  ['medium', `${CONFIG.gpsMediumIntervalMs / 1000}秒ごと`, `${CONFIG.gpsMediumKmh}〜${CONFIG.gpsFastKmh}km`],
  ['continuous', '測り続ける', `${CONFIG.gpsFastKmh}km以上`],
];

/** 今の位置の取り方を1行で(iPhoneで切り替わるかを確かめる用) */
function gpsModeLine(gpsMode: GpsMode | 'sim' | null): string {
  if (!gpsMode) return '';
  if (gpsMode === 'sim') return '<p>位置の取り方: 位置シミュレーター</p>';
  const [, label, pace] = GPS_MODES.find(([m]) => m === gpsMode)!;
  return `<p>位置の取り方: <b>${label}</b>(${pace})</p>`;
}

export function settingsScreen(
  save: SaveData, pendingImport: { data: SaveData; fileName: string } | null, cardCount: number, version: string, gpsMode: GpsMode | 'sim' | null,
): string {
  const confirm = pendingImport
    ? `<div class="panel">
        <h4>この記録で、上書きしますか。</h4>
        <p>「${esc(pendingImport.fileName)}」のカード ${Object.keys(pendingImport.data.collection).length}枚・かけら ${pendingImport.data.shards} で、今の記録を置き換えます。今の記録は消えます。</p>
        <button class="btn" data-act="import-apply">上書きする</button>
        <button class="btn paper" data-act="import-cancel" style="margin-top:12px">やめる</button>
      </div>`
    : '';
  return `<div class="settings">
    <h2>設定</h2>
    <div class="panel"><div class="stats">
      <div><b>${cardCount}</b><span>カード</span></div>
      <div><b>${save.shards}</b><span>かけら</span></div>
      <div><b>${save.totalSpins}</b><span>回した回数</span></div>
    </div></div>
    <div class="panel">
      <h4>注意事項</h4>
      <p>回す権利・確率・記録のしくみで、まちがえやすいところをまとめました。</p>
      <button class="btn paper" data-act="notes">注意事項を見る</button>
    </div>
    <div class="panel">
      <h4>記録</h4>
      <p>集めたカードなどの記録を、ファイルに保存したり戻したりします。機種変更や、念のための控えに。戻す前には確認が出ます。</p>
      <div class="pair">
        <button class="btn mustard" data-act="export">書き出す</button>
        <label class="btn paper file-label">読み込む<input type="file" accept="application/json,.json" data-act="import-file"></label>
      </div>
    </div>
    ${confirm}
    <div class="foot">
      ${gpsModeLine(gpsMode)}
      <p>駅・バス停の位置と地図: © OpenStreetMap contributors。駅・バス停の位置のデータは ODbL(Open Database License)のもとで提供しています。</p>
      <p>書体: Yusei Magic、Zen Maru Gothic(SIL Open Font License 1.1)。</p>
      <p>トリップガチャ ベータ版 ${esc(version)}</p>
    </div>
  </div>`;
}

const km1 = (m: number) => `${m / 1000}km`;

/** 使ううえで誤解しやすいこと。かけらの使い道は書かない(企画で説明しないと決めている) */
const NOTES: [string, string[]][] = [
  ['回す権利', [
    `範囲(${CONFIG.enterRadiusM}m)に入ると、その場所の回す権利がもらえる。権利はその日のうちだけ。日付が変わると消える。`,
    '範囲の外で回すと、その場所の範囲を出たときの確率で引く。出たあとに歩いて確率が上がっても、その場所の確率は上がらない。',
    `同じ場所は、回してから${CONFIG.cooldownMs / 60000}分待つ。待ち時間が終わったあと、もう一度その範囲に入ると、また回せる。`,
  ]],
  ['確率と移動距離', [
    '移動距離は、アプリを開いている間だけ数える。画面を消したり、ほかのアプリに切り替えたりすると数えない。',
    '移動距離は、日付が変わると0に戻る。電車・バスの移動も数える。',
    `${km1(CONFIG.bonusStepM)}進むごとに、ノーマルの確率${CONFIG.bonusPerStepBp / 100}%がスーパーレアに移る。${km1(MAX_M)}で最大。レアの確率は変わらない。`,
    '止まっているときの位置の揺れは数えない。そのため、少しの移動は距離に入らないことがある。',
  ]],
  ['位置', [
    `位置の誤差が${CONFIG.accuracyLimitM}mより大きいときは、範囲に入ったかの判定に使わない。`,
    `歩いているときは${CONFIG.gpsSlowIntervalMs / 1000}秒ごとに位置を取る。範囲の端をかすめただけだと、入ったことにならないことがある。`,
  ]],
  ['カード', [
    '駅のカードは、その駅でしか出ない。バス停のカードは、どのバス停でも同じ120枚から出る。',
  ]],
  ['記録', [
    '記録は、この端末のブラウザの中にだけある。ブラウザのデータを消すと、記録も消える。機種変更のときは、書き出しと読み込みを使う。',
    'iPhone では、Safari で開いたときと、ホーム画面に追加したアプリとで、記録が別々になる。',
    '「更新」ボタンを押しても、記録は消えない。',
  ]],
  ['安全', [
    '範囲の外でも回せる。歩きながら画面を見ず、立ち止まってから回す。',
  ]],
];

export function notesScreen(): string {
  // 長い画面なので、戻るボタンは左上に固定する(スクロールしても押せる)
  return `<div class="settings notes">
    <button class="back-fixed" data-act="close-notes">← 設定に戻る</button>
    <h2>注意事項</h2>
    ${NOTES.map(([title, items]) => `<div class="panel"><h4>${title}</h4><ul>${items.map((t) => `<li>${t}</li>`).join('')}</ul></div>`).join('')}
  </div>`;
}
