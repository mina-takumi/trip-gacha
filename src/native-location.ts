import type { Fix } from './geofence.ts';
import type { LocationError, LocationSource } from './location.ts';

interface NativeLocation { latitude: number; longitude: number; accuracy: number; time: number | null }
interface WatcherOptions { backgroundMessage?: string; backgroundTitle?: string; requestPermissions?: boolean; stale?: boolean; distanceFilter?: number }

export interface NativeWatcher {
  addWatcher(options: WatcherOptions, callback: (location?: NativeLocation, error?: { code?: string }) => void): Promise<string>;
  removeWatcher(options: { id: string }): Promise<void>;
}

export interface NativeTimer {
  setTimeout(fn: () => void, ms: number): number;
  clearTimeout(id: number): void;
}

/** 閉じている間も位置を受け取る(iPhoneアプリ版)。止まっている間は位置が来ないので、最初の1回だけ届くのを待つ */
export function createNativeLocation(plugin: NativeWatcher, timer: NativeTimer, firstFixWaitMs: number, distanceFilterM: number, background: boolean, now = Date.now): LocationSource {
  let last: Fix | null = null;
  let fixCb: (fix: Fix) => void = () => {};
  let errCb: (e: LocationError) => void = () => {};
  let waiting = 0;
  // 切り替えを続けて押しても、前の監視を止めてから次を始められるよう、順番に並べる
  let current: Promise<string | null> = Promise.resolve(null);

  const watch = (on: boolean) => plugin.addWatcher(
    // backgroundMessage の有無が、閉じている間も受け取るかの合図になる
    { ...(on ? { backgroundMessage: '通った駅・バス停を記録しています', backgroundTitle: 'トリップガチャ' } : {}), requestPermissions: true, stale: false, distanceFilter: distanceFilterM },
    (location, error) => {
      if (error) {
        const kind: LocationError = error.code === 'NOT_AUTHORIZED' ? 'denied' : 'unavailable';
        timer.clearTimeout(waiting);
        errCb(kind);
        return;
      }
      if (!location) return;
      timer.clearTimeout(waiting);
      const t = location.time ?? now();
      last = { lat: location.latitude, lon: location.longitude, accuracyM: location.accuracy, t };
      fixCb(last);
    },
  );

  return {
    start(onFix, onError) {
      fixCb = onFix;
      errCb = onError;
      // 位置情報を拒否されたままだと、プラグインは何も返さないことがある
      waiting = timer.setTimeout(() => onError('unavailable'), firstFixWaitMs);
      current = watch(background).catch(() => { onError('unavailable'); return null; });
    },
    // 止まっていると次の位置が来ないので、最後の位置をもう一度渡す(地図の「現在地へ」用)
    refresh() {
      if (last) fixCb(last);
    },
    setBackground(on) {
      current = current.then(async (id) => {
        if (id) await plugin.removeWatcher({ id });
        return watch(on);
      }).catch(() => { errCb('unavailable'); return null; });
    },
  };
}
