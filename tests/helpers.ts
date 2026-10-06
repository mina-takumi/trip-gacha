// テスト用の道具

/** 決まった順に乱数を出す(同じ seed なら毎回同じ結果) */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 緯度1度あたりのメートル(地球の半径 6371008.8m から) */
export const M_PER_DEG_LAT = (6371008.8 * Math.PI) / 180;

/** 基準点から北へ meters 進んだ点 */
export const north = (lat: number, lon: number, meters: number) => ({ lat: lat + meters / M_PER_DEG_LAT, lon });
