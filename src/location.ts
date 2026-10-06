import type { Fix } from './geofence.ts';

export type LocationError = 'denied' | 'unavailable';

/** 現在地を受け取る仕組み。本物のGPSと、開発用のシミュレーターを差し替えられるようにする */
export interface LocationSource {
  start(onFix: (fix: Fix) => void, onError: (e: LocationError) => void): void;
}

export const browserLocation: LocationSource = {
  start(onFix, onError) {
    if (!('geolocation' in navigator)) {
      onError('unavailable');
      return;
    }
    navigator.geolocation.watchPosition(
      (p) => onFix({ lat: p.coords.latitude, lon: p.coords.longitude, accuracyM: p.coords.accuracy, t: Date.now() }),
      (e) => onError(e.code === e.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 },
    );
  },
};
