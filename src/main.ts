// 書体はアプリに入れて配る(オフラインでも使えるように)。使った文字の分だけ読み込まれる
import '@fontsource/yusei-magic/400.css';
import '@fontsource/zen-maru-gothic/700.css';
import '@fontsource/zen-maru-gothic/900.css';
import './style.css';
import spotsJson from '../data/spots.json';
import { CONFIG, RARITIES } from './config.ts';
import { createGeofence, haversineDistanceM, type Fix } from './geofence.ts';
import { createCatalog, type Spot } from './items.ts';
import { drawRarity, metersToNextStep, oddsFor, pickCommon, secretChance, stationItemId } from './gacha.ts';
import { addFix, distanceToday, localDate } from './walk.ts';
import {
  applyBusPassSpin, applyPassCount, applyPassRoute, applyShardSpin, applySpins, busPassToday, canShardSpin, cooldownRemainingMs, exportJson, hasTicket, isPassSegment, load, markVisited, parseSave, save, spinDistanceM, storageAvailable,
  type PassSegment, type SaveData, type Spin, type SpinResult,
} from './store.ts';
import { buildNetwork, inferSegment, passCount, PASS_MODE_LABEL, type Candidate, type Inference, type LatLon, type Network } from './route.ts';
import { browserLocation, type GpsMode, type LocationSource } from './location.ts';
import { createMapView, type MapRanges, type MapView } from './ui/map.ts';
import { ICON_DEFS } from './ui/icons.ts';
import { allCardsSave } from './dev/all-cards.ts';
import {
  busDetailScreen, chooserSheet, detailScreen, passModeSheet, shardInfoSheet, shardSpinSheet, mainScreen, multiResultScreen, notesScreen, resultScreen, secretDetailScreen, settingsScreen, tabbar, zukanScreen,
  type GeoStatus, type NearSpot, type SecretFace, type Tab, type ZukanTab,
} from './ui/screens.ts';

const VERSION = '0.7.0';

// 駅では駅のカード、バス停では共通のカードと、ごくまれに裏カード(バス停ごとに出る物が決まっている)が出る
const spots: Spot[] = spotsJson.spots.map(({ id, name, kind, lat, lon, city }) => ({ id, name, kind, lat, lon, city }));
const stations = spots.filter((s) => s.kind === 'station');
const busStops = spots.filter((s) => s.kind === 'bus_stop');
const catalog = createCatalog(spots);
const cards = catalog.stations;
const spotById = new Map(spots.map((s) => [s.id, s]));
const geofence = createGeofence(spots, {
  enterRadiusM: CONFIG.enterRadiusM, exitRadiusM: CONFIG.exitRadiusM, accuracyLimitM: CONFIG.accuracyLimitM,
});

const storageOk = storageAvailable(globalThis.localStorage);
// 開発中だけ: ?all で「全部集めた」画面を見る。端末の記録は読まず、書きもしない
const allCards = import.meta.env.DEV && new URLSearchParams(location.search).has('all');
// 開発中だけ: ?secret でバス停では必ず裏カードが出る(結果の画面を確かめる用)
const forceSecret = import.meta.env.DEV && new URLSearchParams(location.search).has('secret');

const state = {
  save: allCards ? allCardsSave(stations, catalog.common, busStops, catalog, Date.now())
    : storageOk ? load(localStorage) : load({ getItem: () => null, setItem() {}, removeItem() {} }),
  tab: 'main' as Tab,
  geo: 'starting' as GeoStatus,
  fix: null as Fix | null,
  accuracyM: null as number | null,
  gpsMode: null as GpsMode | 'sim' | null,
  /** 回した結果。1つなら今までの結果画面、2つ以上ならまとめて回した結果画面 */
  results: null as (SpinResult & { spotId: string })[] | null,
  /** まとめて回した結果で、大きく出しているカードの番号。null ならいちばん珍しい1枚 */
  resultPick: null as number | null,
  /** バス停の「回す」を押したときの、1か所だけかまとめてかを選ぶシート */
  chooser: null as { spotId: string; count: number } | null,
  /** かけらで回す前にたずねている駅 */
  shardSpot: null as string | null,
  /** かけらの使い道を見せているか */
  shardInfo: false,
  zukanTab: 'station' as ZukanTab,
  /** 図鑑で開いているもの。駅なら spotId、バス停カード・裏カードなら itemId(common:... / secret:...) */
  detailId: null as string | null,
  showNotes: false,
  pendingImport: null as { data: SaveData; fileName: string } | null,
  toast: null as string | null,
  /** 閉じている間の移動で、乗り物を聞いている区間と、その候補 */
  passAsk: null as { seg: PassSegment; options: Candidate[] } | null,
};

// ベータ版だけ: 推測した道すじを地図に描く(確かめ用)。描くかどうかと、今日の道すじは記録とは別に置く
const PASS_LINES_KEY = 'trip-gacha:pass-lines';
const PASS_DRAW_KEY = 'trip-gacha:pass-draw';
const readLocal = <T>(key: string, fallback: T): T => {
  try {
    return (JSON.parse(localStorage.getItem(key) ?? 'null') as T) ?? fallback;
  } catch {
    return fallback;
  }
};
const writeLocal = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 覚えられなくても遊びは続ける
  }
};
let drawPassLines = readLocal<boolean>(PASS_DRAW_KEY, true);
let passLines = readLocal<{ date: string; lines: LatLon[][] }>(PASS_LINES_KEY, { date: '', lines: [] });
let passLinesShown = '';

// 地図の範囲の表示は見た目の好みなので、記録(書き出すJSON)とは別に置く
const RANGES_KEY = 'trip-gacha:map-ranges';
const mapRanges: MapRanges = (() => {
  const ranges = { station: true, bus: false };
  try {
    const saved = JSON.parse(localStorage.getItem(RANGES_KEY) ?? 'null');
    if (typeof saved?.station === 'boolean') ranges.station = saved.station;
    if (typeof saved?.bus === 'boolean') ranges.bus = saved.bus;
  } catch {
    // 読めなければ最初の状態のまま
  }
  return ranges;
})();

function toggleRange(kind: keyof MapRanges): void {
  mapRanges[kind] = !mapRanges[kind];
  try {
    localStorage.setItem(RANGES_KEY, JSON.stringify(mapRanges));
  } catch {
    // 覚えられなくても、今の表示は切り替える
  }
  mapView?.setRanges(mapRanges);
  for (const b of document.querySelectorAll<HTMLElement>('[data-act="map-range"]')) {
    b.setAttribute('aria-pressed', String(mapRanges[b.dataset.kind as keyof MapRanges]));
  }
}

function persist(): void {
  if (!storageOk || allCards) return;
  try {
    save(localStorage, state.save);
  } catch {
    // 容量不足などで保存できなくても遊びは続ける(起動時の警告はできないので、ここでは黙る)
  }
}

// ---------- 画面の組み立て ----------
const app = document.getElementById('app')!;
app.innerHTML = `${ICON_DEFS}<div class="bar4" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  <main class="screen" id="screen"></main>
  <section class="map-screen" id="map-screen" hidden>
    <div id="map"></div>
    <div class="map-tools">
      <button class="range-btn help" data-act="map-help" aria-expanded="false" aria-controls="map-msg" aria-label="地図の見方">?</button>
      <button class="range-btn station" data-act="map-range" data-kind="station" aria-pressed="${mapRanges.station}">駅の範囲</button>
      <button class="range-btn bus" data-act="map-range" data-kind="bus" aria-pressed="${mapRanges.bus}">バス停の範囲</button>
      <button class="range-btn center" data-act="map-center">現在地へ</button>
      <div class="map-msg panel" id="map-msg" hidden></div>
    </div>
  </section>
  <nav class="tabbar" id="tabbar"></nav>
  <div id="toast"></div>
  <div id="sheet"></div>`;
const screenEl = document.getElementById('screen')!;
const mapScreenEl = document.getElementById('map-screen')!;
const tabbarEl = document.getElementById('tabbar')!;
const toastEl = document.getElementById('toast')!;
const sheetEl = document.getElementById('sheet')!;
let mapView: MapView | null = null;
let onMapTap: ((lat: number, lon: number) => void) | undefined;
/** 図鑑でカードを開く前の位置。戻ったときに同じ場所を出す(結果画面から開いたときは null) */
let zukanScrollY: number | null = null;
if (allCards) document.body.insertAdjacentHTML('beforeend', '<div class="sim-badge all">全部集めた(保存しない)</div>');

/**
 * 回せる駅・バス停かどうか。待ち時間が終わっていて、権利があるか、いま範囲内にいる。
 * 範囲内なら、待ち時間が終わってから次に位置を取るまで(最長15秒)の間も押せる
 */
function canSpin(spotId: string, now: number, inside: Set<string>): boolean {
  return cooldownRemainingMs(state.save, spotId, now) === 0 && (hasTicket(state.save, spotId, now) || inside.has(spotId));
}

/** 今日の回す権利がある場所と、いま範囲内にいる場所(待ち時間中ならその残りを出す)。回せる場所を先に、待ち時間の短い順、近い順 */
function ticketSpots(now: number): NearSpot[] {
  const fix = state.fix;
  const inside = new Set(geofence.insideStopIds());
  return spots
    .filter((spot) => hasTicket(state.save, spot.id, now) || inside.has(spot.id))
    .map((spot) => ({
      spot, badge: spot.kind === 'station' ? cards[spot.id].number : 'バス',
      distanceM: fix ? haversineDistanceM(fix.lat, fix.lon, spot.lat, spot.lon) : null,
      remainingMs: cooldownRemainingMs(state.save, spot.id, now),
      passed: state.save.passedAt[spot.id] != null && state.save.passedAt[spot.id] === state.save.visitedAt[spot.id],
    }))
    .sort((a, b) => a.remainingMs - b.remainingMs || (a.distanceM ?? 0) - (b.distanceM ?? 0));
}

/** 地図でバス停をタップしたときの状態。ホームの「回せる場所」と同じ決まりで見る */
function busStatus(spotId: string): string {
  const now = Date.now();
  const remainingMs = cooldownRemainingMs(state.save, spotId, now);
  if (remainingMs > 0) return `待ち時間 あと${Math.ceil(remainingMs / 60000)}分`;
  return canSpin(spotId, now, new Set(geofence.insideStopIds())) ? 'いま回せる' : `${CONFIG.enterRadiusM}m以内に入ると回せる`;
}

function nearestSpot() {
  if (!state.fix) return null;
  let best: { spot: Spot; distanceM: number } | null = null;
  for (const spot of spots) {
    const d = haversineDistanceM(state.fix.lat, state.fix.lon, spot.lat, spot.lon);
    if (!best || d < best.distanceM) best = { spot, distanceM: d };
  }
  return best;
}

/** 裏カードには番号がないので、番号の欄は「???」 */
function secretFace(itemId: string): SecretFace {
  const c = catalog.describe(itemId)!;
  return { itemId, name: c.name, number: '???', art: c.art };
}

/** 持っている裏カード(手に入れた順) */
const ownedSecrets = (): SecretFace[] => Object.entries(state.save.collection)
  .filter(([id]) => id.startsWith('secret:') && catalog.describe(id))
  .sort(([, a], [, b]) => a.firstAcquiredAt - b.firstAcquiredAt)
  .map(([id]) => secretFace(id));

const ownedSpotIds = () => new Set(stations.filter((s) => RARITIES.some((r) => state.save.collection[stationItemId(s.id, r)])).map((s) => s.id));

function screenHtml(now: number): string {
  if (state.results) {
    const faceOf = (r: SpinResult & { spotId: string }) => r.itemId.startsWith('station:') ? cards[r.spotId]
      : r.rarity === 'SECRET' ? secretFace(r.itemId) : catalog.common.find((c) => c.itemId === r.itemId)!;
    if (state.results.length > 1) {
      return multiResultScreen(state.results.map((r) => ({ face: faceOf(r), rarity: r.rarity, isNew: r.isNew, shardsGained: r.shardsGained })), state.save.shards, state.resultPick);
    }
    const r = state.results[0];
    return resultScreen(faceOf(r), r.rarity, r.itemId.startsWith('station:'), r.isNew, r.shardsGained, state.save.shards);
  }
  switch (state.tab) {
    case 'main': {
      const distanceM = distanceToday(state.save.walk, now);
      return mainScreen({
        distanceM, odds: oddsFor(CONFIG.stationOddsBp, distanceM), busOdds: oddsFor(CONFIG.busOddsBp, distanceM), nextStepM: metersToNextStep(distanceM), shards: state.save.shards,
        geo: state.geo, accuracyM: state.accuracyM, near: ticketSpots(now), nearest: nearestSpot(), storageOk, busPass: busPassToday(state.save, now),
      });
    }
    case 'zukan': {
      const id = state.detailId;
      if (id?.startsWith('common:')) return busDetailScreen(catalog.common.find((c) => c.itemId === id)!, state.save.collection);
      if (id?.startsWith('secret:')) return secretDetailScreen(secretFace(id), state.save.collection[id]?.count ?? 0);
      if (id) return detailScreen(spotById.get(id)!, cards[id], state.save.collection, canShardSpin(state.save, id));
      const secrets = ownedSecrets();
      // 記録を読み込み直して裏カードが無くなったら、「???」の切り替えは消えるので駅に戻す
      if (state.zukanTab === 'secret' && secrets.length === 0) state.zukanTab = 'station';
      return zukanScreen(state.zukanTab, stations, cards, catalog.common, secrets, state.save.collection);
    }
    case 'settings': {
      if (state.showNotes) return notesScreen(ownedSecrets().length > 0);
      const cardCount = Object.keys(state.save.collection).filter((id) => id.startsWith('station:') || id.startsWith('common:')).length;
      return settingsScreen(state.save, state.pendingImport, cardCount, VERSION, state.gpsMode, drawPassLines);
    }
    case 'map':
      return '';
  }
}

let lastHtml = '';
let lastTabs = '';
let lastSheet = '';
function render(): void {
  const now = Date.now();
  // 結果画面だけネイビーの背景で締める
  document.body.classList.toggle('dark', !!state.results);
  // 裏カードが出た結果は、ネイビーの代わりに濃い紫
  document.body.classList.toggle('secret', !!state.results?.some((r) => r.rarity === 'SECRET'));
  const showMap = state.tab === 'map' && !state.results;
  // 同じ中身なら書き換えない(1秒ごとの測位で画面を作り直すと、押している途中のボタンが消えるため)
  const html = showMap ? '' : screenHtml(now);
  if (html !== lastHtml) {
    screenEl.innerHTML = html;
    lastHtml = html;
  }
  screenEl.hidden = showMap;
  mapScreenEl.hidden = !showMap;
  if (showMap) {
    if (!mapView) {
      mapView = createMapView(document.getElementById('map')!, stations, busStops, cards, busStatus, onMapTap);
      mapView.setRanges(mapRanges);
    }
    mapView.resize();
    mapView.update(state.fix, ownedSpotIds());
    const lines = drawPassLines && passLines.date === localDate(now) ? passLines.lines : [];
    const key = `${lines.length}:${passLines.date}`;
    if (key !== passLinesShown) {
      mapView.setPassLines(lines);
      passLinesShown = key;
    }
    document.getElementById('map-msg')!.textContent = onMapTap
      ? '位置シミュレーター: 地図をタップした場所にいることにします'
      : `大きな丸は駅。オレンジは、カードを持っている駅。黄色の小さな点はバス停。点をタップすると、名前と回せるかどうかが出る。駅やバス停の${CONFIG.enterRadiusM}m以内に入ると、その日のうちは、どこでも回せる。`;
  }
  // 前に描いた文字列と比べる。innerHTML と比べると、ブラウザが書き方を変えて返す(<use/> → <use></use>)ので毎回「違う」になり、
  // 測位のたびに作り直して、押している途中のタブが消えていた
  const tabs = tabbar(state.results ? 'main' : state.tab);
  if (tabs !== lastTabs) {
    tabbarEl.innerHTML = tabs;
    lastTabs = tabs;
  }
  toastEl.innerHTML = state.toast ? `<div class="toast" role="status">${state.toast}</div>` : '';
  const ask = state.passAsk;
  const sheet = ask ? passModeSheet(ask.options.map((c) => ({ label: PASS_MODE_LABEL[c.mode], count: c.passes.length })), Math.round((ask.seg.to.t - ask.seg.from.t) / 60000))
    : state.chooser ? chooserSheet(spotById.get(state.chooser.spotId)!.name, state.chooser.count)
    : state.shardSpot ? shardSpinSheet(spotById.get(state.shardSpot)!.name, state.save.shards)
    : state.shardInfo ? shardInfoSheet() : '';
  // 中身が同じなら描き直さない(測位のたびに作り直すと、押している途中のボタンが消える)
  if (sheet !== lastSheet) {
    sheetEl.innerHTML = sheet;
    lastSheet = sheet;
  }
}

let toastTimer = 0;
function showToast(text: string): void {
  state.toast = text;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { state.toast = null; render(); }, 4000);
}

// ---------- 操作 ----------
// 端末に保存した古い版ではなく、公開中の最新版で開き直す。記録は端末に保存してあるので消えない
async function reloadLatest(): Promise<void> {
  showToast('最新版を確かめています。');
  render();
  const reg = await navigator.serviceWorker?.getRegistration().catch(() => undefined);
  try {
    await reg?.update();
  } catch {
    // 電波がないときは、保存してある今の版で開き直す
  }
  const next = reg?.installing ?? reg?.waiting;
  if (next) {
    await new Promise<void>((resolve) => {
      const check = () => { if (next.state === 'activated' || next.state === 'redundant') resolve(); };
      next.addEventListener('statechange', check);
      check();
      setTimeout(resolve, 10_000);
    });
  }
  location.reload();
}

/**
 * 1か所ぶんの抽選。範囲内なら今の距離、範囲の外ならその範囲を出たときの距離で確率を決める。
 * バス停では先に裏カードを引く(確率はその時点のかけらで決まり、移動距離は関係しない)。出なければ共通のカード
 */
function draw(data: SaveData, spotId: string, inside: Set<string>, now: number): Spin {
  const isStation = spotById.get(spotId)!.kind === 'station';
  if (!isStation && (forceSecret || Math.random() < secretChance(data.shards))) return { spotId, rarity: 'SECRET', itemId: catalog.secretAt(spotId) };
  const distanceM = spinDistanceM(data, spotId, inside.has(spotId), distanceToday(data.walk, now), now);
  const rarity = drawRarity(oddsFor(isStation ? CONFIG.stationOddsBp : CONFIG.busOddsBp, distanceM), Math.random);
  const itemId = isStation ? stationItemId(spotId, rarity) : pickCommon(catalog.common, rarity, Math.random).itemId;
  return { spotId, rarity, itemId };
}

/** いま回せるバス停 */
function readyBusStops(now: number, inside: Set<string>): string[] {
  return ticketSpots(now).filter((n) => n.spot.kind === 'bus_stop' && canSpin(n.spot.id, now, inside)).map((n) => n.spot.id);
}

/** 「回す」を押したとき。バス停で、ほかにも回せるバス停があれば、1か所だけかまとめてかを先に聞く */
function spin(spotId: string): void {
  const now = Date.now();
  const inside = new Set(geofence.insideStopIds());
  if (!canSpin(spotId, now, inside)) return;
  if (spotById.get(spotId)!.kind === 'bus_stop') {
    const count = readyBusStops(now, inside).length;
    if (count >= 2) {
      state.chooser = { spotId, count };
      render();
      return;
    }
  }
  spinSpots([spotId]);
}

function spinSpots(spotIds: string[]): void {
  const now = Date.now();
  const inside = new Set(geofence.insideStopIds());
  const ready = spotIds.filter((id) => canSpin(id, now, inside));
  state.chooser = null;
  if (ready.length === 0) { render(); return; }
  const { data, results } = applySpins(state.save, ready, now, (d, id) => draw(d, id, inside, now));
  state.save = data;
  persist();
  state.results = results;
  state.resultPick = null;
  render();
  window.scrollTo(0, 0);
}

/** かけらで駅のガチャを回す。確率はホームの表と同じ(今日の移動距離で上がる)。待ち時間・回す権利は変えない */
function shardSpin(spotId: string): void {
  const now = Date.now();
  state.shardSpot = null;
  const rarity = drawRarity(oddsFor(CONFIG.stationOddsBp, distanceToday(state.save.walk, now)), Math.random);
  const r = applyShardSpin(state.save, spotId, rarity, now);
  if (!r) { render(); return; }
  state.save = r.data;
  persist();
  state.results = [{ ...r.result, spotId }];
  state.resultPick = null;
  render();
  window.scrollTo(0, 0);
}

/** 通過したバス停の回数で1回回す。どのバス停かは決まっていないので、共通のカードだけ(裏カードは出ない)。確率は今の距離 */
function spinBusPass(): void {
  const now = Date.now();
  const rarity = drawRarity(oddsFor(CONFIG.busOddsBp, distanceToday(state.save.walk, now)), Math.random);
  const r = applyBusPassSpin(state.save, rarity, pickCommon(catalog.common, rarity, Math.random).itemId, now);
  if (!r) { render(); return; }
  state.save = r.data;
  persist();
  state.results = [{ ...r.result, spotId: 'bus-pass' }];
  state.resultPick = null;
  render();
  window.scrollTo(0, 0);
}

function exportSave(): void {
  const blob = new Blob([exportJson(state.save)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `trip-gacha-${localDate(Date.now())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
}

app.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
  if (!el) return;
  switch (el.dataset.act) {
    case 'tab':
      state.tab = el.dataset.tab as Tab;
      state.results = null;
      state.chooser = null;
      state.shardSpot = null;
      state.shardInfo = false;
      state.detailId = null;
      state.showNotes = false;
      window.scrollTo(0, 0);
      break;
    case 'notes': state.showNotes = true; window.scrollTo(0, 0); break;
    case 'close-notes': state.showNotes = false; window.scrollTo(0, 0); break;
    case 'spin': spin(el.dataset.spot!); return;
    case 'spin-pass': spinBusPass(); return;
    case 'pass-mode': answerPassMode(Number(el.dataset.i)); return;
    case 'pass-mode-unknown': answerPassMode(null); return;
    case 'toggle-pass-lines':
      drawPassLines = !drawPassLines;
      writeLocal(PASS_DRAW_KEY, drawPassLines);
      break;
    case 'spin-one': if (state.chooser) spinSpots([state.chooser.spotId]); return;
    case 'spin-all': spinSpots(readyBusStops(Date.now(), new Set(geofence.insideStopIds()))); return;
    case 'chooser-cancel': state.chooser = null; break;
    case 'shard-spin': state.shardSpot = el.dataset.spot!; break;
    case 'shard-spin-go': if (state.shardSpot) shardSpin(state.shardSpot); return;
    case 'shard-cancel': state.shardSpot = null; break;
    case 'shard-info': state.shardInfo = true; break;
    case 'shard-info-close': state.shardInfo = false; break;
    case 'result-zukan': {
      // 1枚ならそのカードを開く。まとめて回したとき(バス停だけ)は、バス停の図鑑の一覧へ
      const rs = state.results ?? [];
      const r = rs.length === 1 ? rs[0] : null;
      const isStation = !!r?.itemId.startsWith('station:');
      state.zukanTab = isStation ? 'station' : r?.rarity === 'SECRET' ? 'secret' : 'bus';
      state.detailId = r ? (isStation ? r.spotId : r.itemId) : null;
      zukanScrollY = null;
      state.results = null;
      state.tab = 'zukan';
      window.scrollTo(0, 0);
      break;
    }
    case 'result-back': state.results = null; state.tab = 'main'; state.detailId = null; window.scrollTo(0, 0); break;
    case 'result-pick': state.resultPick = Number(el.dataset.i); break;
    case 'detail':
      zukanScrollY = window.scrollY;
      state.detailId = el.dataset.spot ?? el.dataset.item!;
      window.scrollTo(0, 0);
      break;
    case 'close-detail': {
      const id = state.detailId;
      state.detailId = null;
      render();
      // 一覧から開いたなら元の位置へ。結果画面から開いたなら、そのカードが見える位置へ
      if (zukanScrollY != null) window.scrollTo(0, zukanScrollY);
      else document.querySelector(`[data-spot="${id}"], [data-item="${id}"]`)?.scrollIntoView({ block: 'center' });
      zukanScrollY = null;
      return;
    }
    case 'zukan-tab': state.zukanTab = el.dataset.z as ZukanTab; break;
    case 'export': exportSave(); return;
    case 'import-apply':
      if (state.pendingImport) {
        state.save = state.pendingImport.data;
        persist();
        showToast('記録を読み込みました。');
      }
      state.pendingImport = null;
      break;
    case 'import-cancel': state.pendingImport = null; break;
    case 'map-center': refreshAndCenter(); return;
    case 'map-help': {
      // 地図の見方は、押したときだけ出す(地図を広く見せるため)
      const msg = document.getElementById('map-msg')!;
      msg.hidden = !msg.hidden;
      el.setAttribute('aria-expanded', String(!msg.hidden));
      return;
    }
    case 'map-range': toggleRange(el.dataset.kind as keyof MapRanges); return;
    case 'reload': (el as HTMLButtonElement).disabled = true; reloadLatest(); return;
    default: return;
  }
  render();
});

app.addEventListener('change', async (e) => {
  const input = e.target as HTMLInputElement;
  if (input.dataset.act !== 'import-file' || !input.files?.[0]) return;
  const file = input.files[0];
  try {
    state.pendingImport = { data: parseSave(await file.text()), fileName: file.name };
  } catch (err) {
    state.pendingImport = null;
    showToast(`読み込めませんでした: ${(err as Error).message}。今の記録はそのままです。`);
  }
  input.value = '';
  render();
});

// ---------- 現在地 ----------
let locationSource: LocationSource | null = null;
// 地図の「現在地へ」を押した後、次に届いた位置へ地図を動かす
let centerOnNextFix = false;

function refreshAndCenter(): void {
  if (state.geo === 'denied') {
    showToast('位置情報がオフです。');
  } else {
    showToast('現在地を取り直しています。');
    centerOnNextFix = true;
    locationSource?.refresh();
  }
  render();
}

// ---------- 閉じている間の通過 ----------
// 道のデータ(約2.5MB)は、推測が要るときに初めて読む。端末には最初から保存してあるので電波がなくても読める
let network: Promise<Network> | null = null;
function loadNetwork(): Promise<Network> {
  network ??= Promise.all(['roads', 'transit'].map((n) => fetch(`route/${n}.json`).then((r) => {
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  }))).then(([roads, transit]) => buildNetwork(roads, transit, spots));
  network.catch(() => { network = null; });
  return network;
}

/** 区間を1つ片付ける(先頭の区間)。道すじが出たら通過、出なければバス停の回数。何も付かないこともある */
function resolveSegment(seg: PassSegment, r: Inference): void {
  let data: SaveData = { ...state.save, pending: state.save.pending.slice(1) };
  let message = '';
  if (r.kind === 'route') {
    const before = data.passedAt;
    data = applyPassRoute(data, seg, r.candidate.lengthM, r.candidate.passes);
    const added = Object.keys(data.passedAt).filter((id) => data.passedAt[id] !== before[id]).length;
    if (added > 0) message = `閉じている間に、${added}か所を通過。`;
    const today = localDate(seg.to.t);
    passLines = { date: today, lines: [...(passLines.date === today ? passLines.lines : []), r.candidate.line] };
    writeLocal(PASS_LINES_KEY, passLines);
  } else if (r.kind === 'count') {
    data = applyPassCount(data, seg.to.t, r.count);
    message = `閉じている間に、バス停を${r.count}回ぶん通過。`;
  }
  state.save = data;
  persist();
  if (message) showToast(message);
}

/** 乗り物を聞いたときの答え。null は「わからない」(どのバス停かは決めずに回数だけ) */
function answerPassMode(i: number | null): void {
  const ask = state.passAsk;
  if (!ask) return;
  state.passAsk = null;
  const c = i == null ? null : ask.options[i];
  const count = passCount(ask.seg.from, ask.seg.to);
  resolveSegment(ask.seg, c ? { kind: 'route', candidate: c } : count > 0 ? { kind: 'count', count } : { kind: 'none' });
  render();
  processPending();
}

let processing = false;
/** たまっている区間を順に推測する。乗り物を聞く区間があれば、答えが来るまで止まる。日付が変わった区間は捨てる */
async function processPending(): Promise<void> {
  if (processing || state.passAsk) return;
  const today = localDate(Date.now());
  if (state.save.pending.some((s) => localDate(s.to.t) !== today)) {
    state.save = { ...state.save, pending: state.save.pending.filter((s) => localDate(s.to.t) === today) };
    persist();
  }
  if (state.save.pending.length === 0) return;
  processing = true;
  try {
    const net = await loadNetwork();
    while (state.save.pending.length > 0 && !state.passAsk) {
      const seg = state.save.pending[0];
      const r = inferSegment(net, seg.from, seg.to);
      if (r.kind === 'ask') state.passAsk = { seg, options: r.options };
      else resolveSegment(seg, r);
    }
  } catch {
    // 道のデータが読めない(まだ端末に保存できていない)。区間は残し、次に位置が来たときにもう一度
  } finally {
    processing = false;
    render();
  }
}

function onFix(fix: Fix): void {
  state.fix = fix;
  state.accuracyM = fix.accuracyM;
  const accepted = geofence.update(fix).accepted;
  state.geo = accepted ? 'ok' : 'waiting-accuracy';
  const prevWalk = state.save.walk;
  const walk = addFix(prevWalk, fix);
  // 範囲内にいた記録が、回す権利になる(この後は範囲の外でも回せる)。そのときの移動距離で、外で回すときの確率を決める
  const visited = accepted ? markVisited(state.save, geofence.insideStopIds(), fix.t, distanceToday(walk, fix.t)) : state.save;
  let next: SaveData = { ...visited, walk };
  if (accepted) {
    // 前の位置から時間がたち、離れた所で開き直したら、その間の道すじを推測する区間をためる。
    // 移動距離にはこの位置を受け取ったときにまっすぐの距離が足されているので、推測した道のりからはその分を引いて足す
    if (isPassSegment(state.save.lastFix, fix)) {
      const addedM = walk.distanceDate === prevWalk.distanceDate ? Math.max(0, walk.dailyDistanceM - prevWalk.dailyDistanceM) : 0;
      next = { ...next, pending: [...next.pending, { from: state.save.lastFix!, to: { lat: fix.lat, lon: fix.lon, t: fix.t }, addedM }] };
    }
    next = { ...next, lastFix: { lat: fix.lat, lon: fix.lon, t: fix.t, distanceM: distanceToday(walk, fix.t) } };
  }
  state.save = next;
  persist();
  processPending();
  render();
  if (centerOnNextFix) {
    centerOnNextFix = false;
    mapView?.center();
  }
}

function onLocationError(kind: 'denied' | 'unavailable'): void {
  centerOnNextFix = false;
  // 一度でも測れていれば、一時的な失敗(電波など)は表示を変えない
  if (kind === 'denied' || !state.fix) state.geo = kind;
  // 許可がないと位置を取りに行くのをやめるので、取り方の表示も消す
  if (kind === 'denied') state.gpsMode = null;
  render();
}

async function startLocation(): Promise<void> {
  let source: LocationSource = browserLocation;
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('sim')) {
    const { createSimLocation } = await import('./dev/sim.ts');
    const hachioji = stations.find((s) => s.name === '八王子')!;
    const sim = createSimLocation({ lat: hachioji.lat, lon: hachioji.lon });
    source = sim.source;
    state.gpsMode = 'sim';
    onMapTap = (lat, lon) => sim.moveTo(lat, lon);
    document.body.insertAdjacentHTML('beforeend', '<div class="sim-badge">位置シミュレーター</div>');
  }
  locationSource = source;
  source.start(onFix, onLocationError, (mode) => { state.gpsMode = mode; render(); });
}

render();
startLocation();
// 待ち時間の残りと、日付の変わり目を表示に反映する
setInterval(render, 15_000);
