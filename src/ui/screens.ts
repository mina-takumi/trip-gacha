import { CONFIG, RARITIES, RARITY_LABEL } from '../config.ts';
import type { Odds } from '../gacha.ts';
import { stationItemId } from '../gacha.ts';
import type { Rarity, Spot, StationCard } from '../items.ts';
import type { GpsMode } from '../location.ts';
import type { SaveData } from '../store.ts';
import { cardHtml, placeholderHtml } from './card.ts';
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

/** 回す権利がある駅。distanceM は現在地が分からなければ null */
export interface NearStation { spot: Spot; card: StationCard; distanceM: number | null; remainingMs: number }

export interface MainView {
  distanceM: number;
  odds: Odds;
  nextStepM: number | null;
  shards: number;
  geo: GeoStatus;
  accuracyM: number | null;
  near: NearStation[];
  nearest: { spot: Spot; distanceM: number } | null;
  storageOk: boolean;
}

function geoNotice(v: MainView): string {
  switch (v.geo) {
    case 'starting':
      return `<div class="notice panel"><b>現在地を、さがしています。</b>位置情報の確認が出たら「許可」を選んでください。</div>`;
    case 'denied':
      return `<div class="notice panel warn"><b>位置情報が、オフ。</b>駅の近くにいるかを調べるのに使います。ブラウザの設定で、このページに位置情報の利用を許可してから開き直してください。iPhone では「設定」アプリの「プライバシーとセキュリティ」→「位置情報サービス」で、Safari の位置情報がオンになっているかも確かめてください。</div>`;
    case 'unavailable':
      return `<div class="notice panel warn"><b>現在地が、取れない。</b>空の見える場所で少し待つか、アプリを開き直してください。</div>`;
    case 'waiting-accuracy':
      return `<div class="notice panel"><b>位置の精度を、待っています。</b>今の誤差は約${Math.round(v.accuracyM ?? 0)}m。${CONFIG.accuracyLimitM}m以内になるまで、駅の判定に使いません。</div>`;
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
  const near = v.near.map((n) => {
    const ready = n.remainingMs <= 0;
    const button = ready
      ? `<button class="btn" data-act="spin" data-spot="${esc(n.spot.id)}">${icon('capsule')}回す</button>`
      : `<button class="btn wait" disabled>あと${Math.ceil(n.remainingMs / 60000)}分。少し、寄り道を。</button>`;
    return `<div class="st panel"><div class="t"><span class="no ${ready ? '' : 'mute'}">${esc(n.card.number)}</span><span class="name">${esc(n.spot.name)}</span><span class="d">${n.distanceM == null ? '' : distanceLabel(n.distanceM)}</span></div>${button}</div>`;
  }).join('');
  // 今日もらった権利は、位置が取れていなくても使える
  const list = v.near.length > 0 ? `<div class="sec"><span>回せる駅</span>${icon('gachapon', 'deco')}</div>${near}` : '';
  const empty = v.geo === 'ok' && v.near.length === 0
    ? `<p class="say">近くに駅なし。${v.nearest ? `${esc(v.nearest.spot.name)}まで、あと${distanceLabel(v.nearest.distanceM)}。` : ''}</p>`
    : '';
  const od = (r: Rarity, cls = '') => `<div class="od panel ${cls}"><b>${pct(v.odds[r])}<small>%</small></b><span><i class="dot ${r}"></i>${RARITY_LABEL[r]}</span></div>`;
  return `
    ${v.storageOk ? '' : '<div class="notice panel warn"><b>記録が、残せません。</b>このブラウザでは端末に記録を保存できないため、閉じると集めたカードが消えます。プライベートブラウズなら、通常のモードで開いてください。</div>'}
    <div class="top"><span class="logo">トリップガチャ</span><span class="top-r"><button class="reload" data-act="reload" aria-label="最新版に更新">${icon('reload')}<span class="reload-t">更新</span></button><span class="shard"><span class="ic">${icon('shard')}</span>かけら ${v.shards}</span></span></div>
    <div class="lead">今日、歩いた。</div>
    <div class="huge">${km(v.distanceM)}<small>km</small></div>
    <div class="feet" role="img" aria-label="${km(MAX_M)}kmまでのうち${km(v.distanceM)}km">${feet}</div>
    <div class="feet-cap">${caption}</div>
    <div class="odds">${od('NORMAL')}${od('RARE')}${od('SUPER_RARE', 'sr')}</div>
    ${geoNotice(v)}
    ${list}${empty}`;
}

export function resultScreen(card: StationCard, rarity: Rarity, isNew: boolean, shardsGained: number, totalShards: number): string {
  const label = RARITY_LABEL[rarity].replace('スーパー', 'スーパー<br>');
  return `<div class="res-wrap"><div class="res">
    <div class="stamp ${rarity}"><span>${label}</span></div>
    <h2>出た。</h2>
    <div class="sub">${isNew
      ? '<span class="mark o">はじめての1枚。</span>図鑑に入りました。'
      : `もう持ってた。<span class="mark o">かけら +${shardsGained}</span>(合計 ${totalShards})。`}</div>
    <div class="rays">${cardHtml(card, rarity, 'big')}</div>
    <div class="acts">
      <button class="btn mustard" data-act="result-zukan">${icon('book')}図鑑で見る</button>
      <button class="btn cream" data-act="result-back">ホームに戻る</button>
    </div>
  </div></div>`;
}

const ownedRarities = (collection: SaveData['collection'], spotId: string) => RARITIES.filter((r) => collection[stationItemId(spotId, r)]);
const ox = (have: Rarity[]) => RARITIES.map((r) => have.includes(r) ? '<span class="o">○</span>' : '<span class="x">×</span>').join('');

export function zukanScreen(stations: Spot[], cards: Record<string, StationCard>, collection: SaveData['collection']): string {
  const total = stations.length * RARITIES.length;
  const owned = stations.reduce((n, s) => n + ownedRarities(collection, s.id).length, 0);
  const lead = owned === total ? '<span class="mark">ぜんぶ、集めた。</span>' : owned === 0 ? '駅の近くで、回してみる。' : '<span class="mark">まだ、たくさんある。</span>';
  const tiles = stations.map((s) => {
    const have = ownedRarities(collection, s.id);
    const best = have[have.length - 1];
    return `<button class="tile ${best ? '' : 'none'}" data-act="detail" data-spot="${esc(s.id)}" aria-label="${esc(s.name)}">
      ${best ? cardHtml(cards[s.id], best, 'sm') : placeholderHtml(cards[s.id].number)}
      <div class="sn">${esc(s.name)}</div>
      <div class="ox" aria-label="${have.map((r) => RARITY_LABEL[r]).join('・') || 'まだなし'}">${ox(have)}</div>
    </button>`;
  }).join('');
  return `<div class="z-top"><h2>図鑑</h2><div class="count">${owned}<small> / ${total}枚</small></div></div>
    <div class="z-lead">${stations.length}駅 × 3段階。${lead}</div>
    <div class="grid">${tiles}</div>`;
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

const GPS_MODE_LABEL: Record<GpsMode | 'sim', string> = {
  slow: `${CONFIG.gpsSlowIntervalMs / 1000}秒ごと`, medium: `${CONFIG.gpsMediumIntervalMs / 1000}秒ごと`, continuous: '測り続ける', sim: 'シミュレーター',
};

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
      <h4>記録の書き出し</h4>
      <p>集めたカードなどの記録を、ファイルに保存します。機種変更や、念のための控えに。</p>
      <button class="btn mustard" data-act="export">記録を書き出す</button>
    </div>
    <div class="panel">
      <h4>記録の読み込み</h4>
      <p>書き出したファイルから記録を戻します。読み込む前に確認が出ます。</p>
      <label class="btn paper file-label">記録を読み込む<input type="file" accept="application/json,.json" data-act="import-file"></label>
    </div>
    ${confirm}
    <div class="panel">
      <h4>データの出典</h4>
      <p>駅の位置と地図: © OpenStreetMap contributors。駅の位置のデータは ODbL(Open Database License)のもとで提供しています。<br>書体: Yusei Magic、Zen Maru Gothic(SIL Open Font License 1.1)。</p>
    </div>
    <p class="ver">トリップガチャ ベータ版 ${esc(version)}${gpsMode ? `<br>位置の取り方: ${GPS_MODE_LABEL[gpsMode]}` : ''}</p>
  </div>`;
}
