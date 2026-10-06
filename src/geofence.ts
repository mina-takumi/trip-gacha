// 駅・バス停の入退出判定。geofence.js(位置判定の試作 hachioji-geofence-testbench から流用)を TypeScript に移したもの。
// 時刻 t は epoch ミリ秒だけを受け取り、このファイルの中で「今の時刻」を読まない(シミュレーションの早送りとずれるため)。
// 地図・DOM・乱数は参照しない。

// IUGG の平均半径。Leaflet の既定(6371000)とは 8.8m 違うが、200m の判定では差は 0.0003m 未満。
export const EARTH_RADIUS_M = 6371008.8;

const DEG_TO_RAD = Math.PI / 180;

/** 2点間の大円距離(メートル)。 */
export function haversineDistanceM(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const dLat = (bLat - aLat) * DEG_TO_RAD;
  const dLon = (bLon - aLon) * DEG_TO_RAD;
  const lat1 = aLat * DEG_TO_RAD;
  const lat2 = bLat * DEG_TO_RAD;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  // asin(min(1, ...)) にしているのは、丸めで h がわずかに 1 を超えて NaN になるのを防ぐため
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface Stop {
  id: string;
  name: string;
  kind: string;
  lat: number;
  lon: number;
}

export interface Fix {
  lat: number;
  lon: number;
  /** 測位精度(m)。null のときは足切りしない(真値の疑似測位) */
  accuracyM: number | null;
  /** epoch ミリ秒 */
  t: number;
}

export interface GeofenceEvent {
  type: 'enter' | 'exit';
  stopId: string;
  stopName: string;
  kind: string;
  t: number;
  lat: number;
  lon: number;
  accuracyM: number | null;
  distanceM: number;
}

export interface GeofenceParams {
  /** この距離以内に入ったら「入圏」 */
  enterRadiusM: number;
  /** この距離より外に出たら「退出」。入圏と同じ値にすると、境界上で入退出を延々と繰り返す */
  exitRadiusM: number;
  /** 測位精度がこれより悪い測位は捨てる(0で無効) */
  accuracyLimitM: number;
}

export interface GeofenceState {
  v: 1;
  inside: Record<string, number>;
}

export function createGeofence(stops: Stop[], params: GeofenceParams) {
  const enterRadiusM = params.enterRadiusM;
  const exitRadiusM = Math.max(params.exitRadiusM, params.enterRadiusM);
  const accuracyLimitM = params.accuracyLimitM || 0;

  // stop_id -> 最後に計算した距離。「このキーが存在する = 今その圏内にいる」
  let insideDistances = new Map<string, number>();

  function makeEvent(type: 'enter' | 'exit', stop: Stop, fix: Fix, distanceM: number): GeofenceEvent {
    return {
      type, stopId: stop.id, stopName: stop.name, kind: stop.kind, t: fix.t, lat: fix.lat, lon: fix.lon,
      accuracyM: fix.accuracyM ?? null, distanceM,
    };
  }

  return {
    /** 測位を1点流し込む。accepted が false(精度の足切り)のとき events は空 */
    update(fix: Fix): { accepted: boolean; events: GeofenceEvent[] } {
      // 精度が悪すぎる測位は判定に使わない。ここで捨てないと、誤差で遠くの停留所を拾った誤検知が大量に出る
      if (accuracyLimitM > 0 && fix.accuracyM != null && fix.accuracyM > accuracyLimitM) {
        return { accepted: false, events: [] };
      }
      const events: GeofenceEvent[] = [];
      // stops の順に走査するので、同じ入力なら常に同じ順でイベントが出る
      for (const s of stops) {
        const d = haversineDistanceM(fix.lat, fix.lon, s.lat, s.lon);
        if (!insideDistances.has(s.id)) {
          if (d <= enterRadiusM) {
            insideDistances.set(s.id, d);
            events.push(makeEvent('enter', s, fix, d));
          }
        } else if (d > exitRadiusM) {
          insideDistances.delete(s.id);
          events.push(makeEvent('exit', s, fix, d));
        } else {
          insideDistances.set(s.id, d);
        }
      }
      return { accepted: true, events };
    },

    /** 今どの停留所の圏内にいるか。素のオブジェクトだけを返す */
    exportState(): GeofenceState {
      return { v: 1, inside: Object.fromEntries(insideDistances) };
    },

    /** exportState() の戻り値を戻す。形が違えば何もしない(壊れた保存で落とさない) */
    importState(obj: unknown): void {
      insideDistances = new Map();
      const state = obj as Partial<GeofenceState> | null;
      if (!state || state.v !== 1 || !state.inside) return;
      for (const [k, v] of Object.entries(state.inside)) insideDistances.set(k, v);
    },

    /** 現在圏内の stop_id 一覧(stops の順) */
    insideStopIds(): string[] {
      return stops.filter((s) => insideDistances.has(s.id)).map((s) => s.id);
    },
  };
}

export type Geofence = ReturnType<typeof createGeofence>;
