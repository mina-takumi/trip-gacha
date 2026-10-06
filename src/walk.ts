import { CONFIG } from './config.ts';
import { haversineDistanceM, type Fix } from './geofence.ts';

interface Point { lat: number; lon: number; accM: number }

export interface WalkState {
  /** その日の移動距離(m) */
  dailyDistanceM: number;
  /** 移動距離の対象日 YYYY-MM-DD(端末の時刻で) */
  distanceDate: string;
  /** ならした現在地。測位をそのまま使うと、止まっていてもGPSの揺れで距離が積み上がるため */
  smooth: Point | null;
  /** 距離を測る起点。ならした現在地がここから十分離れたら距離を足し、起点を進める */
  anchor: Point | null;
}

export const emptyWalk = (): WalkState => ({ dailyDistanceM: 0, distanceDate: '', smooth: null, anchor: null });

/** epoch ミリ秒を端末の時刻での日付 YYYY-MM-DD にする */
export function localDate(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * 測位を1点受け取り、移動距離を足した新しい状態を返す。乗り物での移動も数える(速さでは区別しない)。
 * 止まっている間の揺れを数えないよう、位置をならし、起点から「最低15m、または2点の誤差の和」以上離れたときだけ足す。
 */
export function addFix(state: WalkState, fix: Fix): WalkState {
  if (fix.accuracyM != null && fix.accuracyM > CONFIG.accuracyLimitM) return state;
  const p: Point = { lat: fix.lat, lon: fix.lon, accM: fix.accuracyM ?? 0 };
  const today = localDate(fix.t);
  if (state.distanceDate !== today) return { dailyDistanceM: 0, distanceDate: today, smooth: p, anchor: p };
  if (!state.smooth || !state.anchor) return { ...state, smooth: p, anchor: p };

  const w = CONFIG.smoothingWeight;
  const smooth: Point = {
    lat: state.smooth.lat + w * (p.lat - state.smooth.lat),
    lon: state.smooth.lon + w * (p.lon - state.smooth.lon),
    accM: p.accM,
  };
  const d = haversineDistanceM(state.anchor.lat, state.anchor.lon, smooth.lat, smooth.lon);
  if (d < Math.max(CONFIG.minMoveM, state.anchor.accM + smooth.accM)) return { ...state, smooth };
  return { ...state, dailyDistanceM: state.dailyDistanceM + d, smooth, anchor: smooth };
}

/** 日付が変わったのに測位がまだ来ていないときも、表示は0にする */
export function distanceToday(state: WalkState, now: number): number {
  return state.distanceDate === localDate(now) ? state.dailyDistanceM : 0;
}
