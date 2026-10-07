// 書体はアプリに入れて配る(オフラインでも使えるように)。使った文字の分だけ読み込まれる
import '@fontsource/yusei-magic/400.css';
import '@fontsource/zen-maru-gothic/700.css';
import '@fontsource/zen-maru-gothic/900.css';
import './style.css';
import spotsJson from '../data/spots.json';
import { CONFIG, RARITIES } from './config.ts';
import { createGeofence, haversineDistanceM, type Fix } from './geofence.ts';
import { createCatalog, type Spot } from './items.ts';
import { drawRarity, metersToNextStep, oddsFor, stationItemId } from './gacha.ts';
import { addFix, distanceToday, localDate } from './walk.ts';
import {
  applySpin, cooldownRemainingMs, exportJson, hasTicket, load, markVisited, parseSave, save, storageAvailable, type SaveData, type SpinResult,
} from './store.ts';
import { browserLocation, type GpsMode, type LocationSource } from './location.ts';
import { createMapView, type MapView } from './ui/map.ts';
import { ICON_DEFS } from './ui/icons.ts';
import {
  detailScreen, mainScreen, resultScreen, settingsScreen, tabbar, zukanScreen, type GeoStatus, type NearStation, type Tab,
} from './ui/screens.ts';

const VERSION = '0.1.5';

// ベータ版は駅だけ
const stations: Spot[] = spotsJson.spots
  .filter((s) => s.kind === 'station')
  .map(({ id, name, kind, lat, lon }) => ({ id, name, kind, lat, lon }));
const cards = createCatalog(stations).stations;
const spotById = new Map(stations.map((s) => [s.id, s]));
const geofence = createGeofence(stations, {
  enterRadiusM: CONFIG.enterRadiusM, exitRadiusM: CONFIG.exitRadiusM, accuracyLimitM: CONFIG.accuracyLimitM,
});

const storageOk = storageAvailable(globalThis.localStorage);

const state = {
  save: storageOk ? load(localStorage) : load({ getItem: () => null, setItem() {}, removeItem() {} }),
  tab: 'main' as Tab,
  geo: 'starting' as GeoStatus,
  fix: null as Fix | null,
  accuracyM: null as number | null,
  gpsMode: null as GpsMode | 'sim' | null,
  result: null as (SpinResult & { spotId: string }) | null,
  detailSpotId: null as string | null,
  pendingImport: null as { data: SaveData; fileName: string } | null,
  toast: null as string | null,
};

function persist(): void {
  if (!storageOk) return;
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
    <div class="map-tools"><div class="map-msg panel" id="map-msg"></div><button class="btn" data-act="map-center">現在地へ</button></div>
  </section>
  <nav class="tabbar" id="tabbar"></nav>
  <div id="toast"></div>`;
const screenEl = document.getElementById('screen')!;
const mapScreenEl = document.getElementById('map-screen')!;
const tabbarEl = document.getElementById('tabbar')!;
const toastEl = document.getElementById('toast')!;
let mapView: MapView | null = null;
let onMapTap: ((lat: number, lon: number) => void) | undefined;

/**
 * 回せる駅かどうか。待ち時間が終わっていて、権利があるか、いま範囲内にいる。
 * 範囲内なら、待ち時間が終わってから次に位置を取るまで(最長15秒)の間も押せる
 */
function canSpin(spotId: string, now: number, inside: Set<string>): boolean {
  return cooldownRemainingMs(state.save, spotId, now) === 0 && (hasTicket(state.save, spotId, now) || inside.has(spotId));
}

/** 今日の回す権利がある駅と、いま範囲内にいる駅(待ち時間中ならその残りを出す)。回せる駅を先に、待ち時間の短い順 */
function ticketStations(now: number): NearStation[] {
  const fix = state.fix;
  const inside = new Set(geofence.insideStopIds());
  return stations
    .filter((spot) => hasTicket(state.save, spot.id, now) || inside.has(spot.id))
    .map((spot) => ({
      spot, card: cards[spot.id],
      distanceM: fix ? haversineDistanceM(fix.lat, fix.lon, spot.lat, spot.lon) : null,
      remainingMs: cooldownRemainingMs(state.save, spot.id, now),
    }))
    .sort((a, b) => a.remainingMs - b.remainingMs);
}

function nearestStation() {
  if (!state.fix) return null;
  let best: { spot: Spot; distanceM: number } | null = null;
  for (const spot of stations) {
    const d = haversineDistanceM(state.fix.lat, state.fix.lon, spot.lat, spot.lon);
    if (!best || d < best.distanceM) best = { spot, distanceM: d };
  }
  return best;
}

const ownedSpotIds = () => new Set(stations.filter((s) => RARITIES.some((r) => state.save.collection[stationItemId(s.id, r)])).map((s) => s.id));

function screenHtml(now: number): string {
  if (state.result) {
    const r = state.result;
    return resultScreen(cards[r.spotId], r.rarity, r.isNew, r.shardsGained, state.save.shards);
  }
  switch (state.tab) {
    case 'main': {
      const distanceM = distanceToday(state.save.walk, now);
      return mainScreen({
        distanceM, odds: oddsFor(CONFIG.stationOddsBp, distanceM), nextStepM: metersToNextStep(distanceM), shards: state.save.shards,
        geo: state.geo, accuracyM: state.accuracyM, near: ticketStations(now), nearest: nearestStation(), storageOk,
      });
    }
    case 'zukan':
      return state.detailSpotId
        ? detailScreen(spotById.get(state.detailSpotId)!, cards[state.detailSpotId], state.save.collection)
        : zukanScreen(stations, cards, state.save.collection);
    case 'settings': {
      const cardCount = Object.keys(state.save.collection).filter((id) => id.startsWith('station:')).length;
      return settingsScreen(state.save, state.pendingImport, cardCount, VERSION, state.gpsMode);
    }
    case 'map':
      return '';
  }
}

let lastHtml = '';
function render(): void {
  const now = Date.now();
  // 結果画面だけネイビーの背景で締める
  document.body.classList.toggle('dark', !!state.result);
  const showMap = state.tab === 'map' && !state.result;
  // 同じ中身なら書き換えない(1秒ごとの測位で画面を作り直すと、押している途中のボタンが消えるため)
  const html = showMap ? '' : screenHtml(now);
  if (html !== lastHtml) {
    screenEl.innerHTML = html;
    lastHtml = html;
  }
  screenEl.hidden = showMap;
  mapScreenEl.hidden = !showMap;
  if (showMap) {
    if (!mapView) mapView = createMapView(document.getElementById('map')!, stations, cards, onMapTap);
    mapView.resize();
    mapView.update(state.fix, ownedSpotIds());
    document.getElementById('map-msg')!.textContent = onMapTap
      ? '位置シミュレーター: 地図をタップした場所にいることにします'
      : 'オレンジは、カードを持っている駅。点線の円に入ると、その日のうちは、どこでも回せる。';
  }
  const tabs = tabbar(state.result ? 'main' : state.tab);
  if (tabbarEl.innerHTML !== tabs) tabbarEl.innerHTML = tabs;
  toastEl.innerHTML = state.toast ? `<div class="toast" role="status">${state.toast}</div>` : '';
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

function spin(spotId: string): void {
  const now = Date.now();
  if (!canSpin(spotId, now, new Set(geofence.insideStopIds()))) return;
  const rarity = drawRarity(oddsFor(CONFIG.stationOddsBp, distanceToday(state.save.walk, now)), Math.random);
  const { data, result } = applySpin(state.save, spotId, rarity, now);
  state.save = data;
  persist();
  state.result = { ...result, spotId };
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
      state.result = null;
      state.detailSpotId = null;
      window.scrollTo(0, 0);
      break;
    case 'spin': spin(el.dataset.spot!); return;
    case 'result-zukan':
      state.detailSpotId = state.result?.spotId ?? null;
      state.result = null;
      state.tab = 'zukan';
      window.scrollTo(0, 0);
      break;
    case 'result-back': state.result = null; break;
    case 'detail': state.detailSpotId = el.dataset.spot!; window.scrollTo(0, 0); break;
    case 'close-detail': state.detailSpotId = null; break;
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
    case 'map-center': mapView?.center(); return;
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
function onFix(fix: Fix): void {
  state.fix = fix;
  state.accuracyM = fix.accuracyM;
  const accepted = geofence.update(fix).accepted;
  state.geo = accepted ? 'ok' : 'waiting-accuracy';
  // 範囲内にいた記録が、回す権利になる(この後は範囲の外でも回せる)
  const visited = accepted ? markVisited(state.save, geofence.insideStopIds(), fix.t) : state.save;
  state.save = { ...visited, walk: addFix(state.save.walk, fix) };
  persist();
  render();
}

function onLocationError(kind: 'denied' | 'unavailable'): void {
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
  source.start(onFix, onLocationError, (mode) => { state.gpsMode = mode; render(); });
}

render();
startLocation();
// 待ち時間の残りと、日付の変わり目を表示に反映する
setInterval(render, 15_000);
