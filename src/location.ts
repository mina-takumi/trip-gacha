import { CONFIG } from './config.ts';
import { haversineDistanceM, type Fix } from './geofence.ts';

export type LocationError = 'denied' | 'unavailable';

/** 位置の取り方。slow・medium は決まった秒数ごとに取りに行き、continuous は測り続ける */
export type GpsMode = 'slow' | 'medium' | 'continuous';

/** 現在地を受け取る仕組み。本物のGPSと、開発用のシミュレーターを差し替えられるようにする */
export interface LocationSource {
  start(onFix: (fix: Fix) => void, onError: (e: LocationError) => void, onMode?: (mode: GpsMode) => void): void;
}

/** GPSから届く1回分の位置。speedMps は端末が教えてくれる速さ(m/秒)。分からなければ null */
export interface Reading { lat: number; lon: number; accuracyM: number; speedMps: number | null; t: number }

/** GPSそのもの。テストでは偽物に差し替える */
export interface GpsDevice {
  getOnce(onReading: (r: Reading) => void, onError: (e: LocationError) => void): void;
  watch(onReading: (r: Reading) => void, onError: (e: LocationError) => void): number;
  clearWatch(id: number): void;
}

export interface Clock {
  setTimeout(fn: () => void, ms: number): number;
  clearTimeout(id: number): void;
}

/** 時速(km)。端末の速さがあればそれを使い、無ければ前の位置との差から出す。2点の誤差の和より短い移動は止まっている扱い */
export function speedKmh(prev: Reading | null, cur: Reading): number {
  if (cur.speedMps != null && cur.speedMps >= 0) return cur.speedMps * 3.6;
  if (!prev || cur.t <= prev.t) return 0;
  const d = haversineDistanceM(prev.lat, prev.lon, cur.lat, cur.lon);
  if (d <= prev.accuracyM + cur.accuracyM) return 0;
  return (d / ((cur.t - prev.t) / 1000)) * 3.6;
}

/**
 * 速さから次の取り方を決める。測り続けている間は、遅くなってもすぐには戻さない
 * (駅で一瞬止まるたびに切り替わらないよう、遅い状態が決まった時間続いてから戻す)。
 * lowSince は「測り続けている間に遅くなった時刻」。
 */
export function decideMode(current: GpsMode, kmh: number, lowSince: number | null, now: number): { mode: GpsMode; lowSince: number | null } {
  const byPace: GpsMode = kmh >= CONFIG.gpsFastKmh ? 'continuous' : kmh >= CONFIG.gpsMediumKmh ? 'medium' : 'slow';
  if (current !== 'continuous' || byPace === 'continuous') return { mode: byPace, lowSince: null };
  if (kmh >= CONFIG.gpsLeaveFastKmh) return { mode: 'continuous', lowSince: null };
  const since = lowSince ?? now;
  return now - since >= CONFIG.gpsLeaveFastAfterMs ? { mode: byPace, lowSince: null } : { mode: 'continuous', lowSince: since };
}

const intervalMs = (mode: GpsMode) => (mode === 'medium' ? CONFIG.gpsMediumIntervalMs : CONFIG.gpsSlowIntervalMs);

/** 速さに合わせてGPSの取り方を切り替える。wake() は、すぐに1回取りに行く(アプリが表に戻ったとき用) */
export function createAdaptiveLocation(device: GpsDevice, clock: Clock): LocationSource & { wake(): void } {
  let mode: GpsMode = 'slow';
  let lowSince: number | null = null;
  let prev: Reading | null = null;
  let timer: number | null = null;
  let watchId: number | null = null;
  let busy = false;
  let stopped = false;
  let fixCb: (fix: Fix) => void = () => {};
  let errCb: (e: LocationError) => void = () => {};
  let modeCb: (mode: GpsMode) => void = () => {};

  const schedule = () => {
    if (timer != null) clock.clearTimeout(timer);
    timer = stopped || mode === 'continuous' ? null : clock.setTimeout(poll, intervalMs(mode));
  };

  const setMode = (next: GpsMode) => {
    if (next === mode) return;
    const was = mode;
    mode = next;
    if (next === 'continuous') {
      if (timer != null) clock.clearTimeout(timer);
      timer = null;
      watchId = device.watch(onReading, onError);
    } else if (was === 'continuous') {
      if (watchId != null) device.clearWatch(watchId);
      watchId = null;
      schedule();
    }
    modeCb(mode);
  };

  function onReading(r: Reading) {
    if (stopped) return;
    fixCb({ lat: r.lat, lon: r.lon, accuracyM: r.accuracyM, t: r.t });
    // 精度の悪い位置は速さの計算にも使わない(大きく跳んで、速く動いたように見えるため)
    if (r.accuracyM > CONFIG.accuracyLimitM) return;
    const decided = decideMode(mode, speedKmh(prev, r), lowSince, r.t);
    prev = r;
    lowSince = decided.lowSince;
    setMode(decided.mode);
  }

  function onError(e: LocationError) {
    if (e === 'denied') {
      stopped = true;
      if (timer != null) clock.clearTimeout(timer);
      if (watchId != null) device.clearWatch(watchId);
      timer = watchId = null;
    }
    errCb(e);
  }

  function poll() {
    timer = null;
    if (stopped || busy || mode === 'continuous') return;
    busy = true;
    device.getOnce(
      (r) => { busy = false; onReading(r); schedule(); },
      (e) => { busy = false; onError(e); schedule(); },
    );
  }

  return {
    start(onFix, onErr, onMode) {
      fixCb = onFix;
      errCb = onErr;
      if (onMode) modeCb = onMode;
      modeCb(mode);
      poll();
    },
    wake() {
      if (mode === 'continuous') return;
      if (timer != null) clock.clearTimeout(timer);
      timer = null;
      poll();
    },
  };
}

const toReading = (p: GeolocationPosition, now: number): Reading => ({
  lat: p.coords.latitude, lon: p.coords.longitude, accuracyM: p.coords.accuracy, speedMps: p.coords.speed ?? null, t: now,
});
const toError = (e: GeolocationPositionError): LocationError => (e.code === e.PERMISSION_DENIED ? 'denied' : 'unavailable');

export const browserLocation: LocationSource = {
  start(onFix, onError, onMode) {
    if (!('geolocation' in navigator)) {
      onError('unavailable');
      return;
    }
    const geo = navigator.geolocation;
    const device: GpsDevice = {
      getOnce: (ok, ng) => geo.getCurrentPosition((p) => ok(toReading(p, Date.now())), (e) => ng(toError(e)),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 20_000 }),
      watch: (ok, ng) => geo.watchPosition((p) => ok(toReading(p, Date.now())), (e) => ng(toError(e)),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 30_000 }),
      clearWatch: (id) => geo.clearWatch(id),
    };
    const clock: Clock = {
      setTimeout: (fn, ms) => window.setTimeout(fn, ms),
      clearTimeout: (id) => window.clearTimeout(id),
    };
    const adaptive = createAdaptiveLocation(device, clock);
    adaptive.start(onFix, onError, onMode);
    // 画面を消している間は位置が取れない。表に戻ったら待たずに1回取りに行く
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') adaptive.wake();
    });
  },
};
