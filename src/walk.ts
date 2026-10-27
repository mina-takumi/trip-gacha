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
  /** 最後に使った測位の時刻。間隔に合わせて、ならす割合を変えるため */
  lastFixAt: number | null;
}

export const emptyWalk = (): WalkState => ({ dailyDistanceM: 0, distanceDate: '', smooth: null, anchor: null, lastFixAt: null });

/**
 * 新しい測位を混ぜる割合。1秒ごとの割合を、間の秒数だけ続けて混ぜたのと同じにする(15秒ごとでも遅れないように)。
 * ただし上限で止める(止まっている間の揺れを、ならしで抑えるため)。長く空いたら、ならさず新しい位置をそのまま使う。
 */
function mixWeight(lastFixAt: number | null, t: number): number {
  const gapMs = lastFixAt == null ? 1000 : t - lastFixAt;
  if (gapMs >= CONFIG.smoothingResetAfterMs) return 1;
  const w = 1 - (1 - CONFIG.smoothingWeight) ** Math.max(1, gapMs / 1000);
  return Math.min(w, CONFIG.smoothingWeightMax);
}

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
  if (state.distanceDate !== today) return { dailyDistanceM: 0, distanceDate: today, smooth: p, anchor: p, lastFixAt: fix.t };
  if (!state.smooth || !state.anchor) return { ...state, smooth: p, anchor: p, lastFixAt: fix.t };

  const w = mixWeight(state.lastFixAt, fix.t);
  const smooth: Point = {
    lat: state.smooth.lat + w * (p.lat - state.smooth.lat),
    lon: state.smooth.lon + w * (p.lon - state.smooth.lon),
    accM: p.accM,
  };
  const d = haversineDistanceM(state.anchor.lat, state.anchor.lon, smooth.lat, smooth.lon);
  if (d < Math.max(CONFIG.minMoveM, state.anchor.accM + smooth.accM)) return { ...state, smooth, lastFixAt: fix.t };
  return { ...state, dailyDistanceM: state.dailyDistanceM + d, smooth, anchor: smooth, lastFixAt: fix.t };
}

/** 日付が変わったのに測位がまだ来ていないときも、表示は0にする */
export function distanceToday(state: WalkState, now: number): number {
  return state.distanceDate === localDate(now) ? state.dailyDistanceM : 0;
}
