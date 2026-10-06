import type { Rarity } from './items.ts';

// 遊びながら調整する数値。ここだけ直せば全体に効く
export const CONFIG = {
  /** この距離以内に入ったら回せる */
  enterRadiusM: 200,
  /** この距離より外に出たら一覧から消える。入る距離と分けて、境目でちらつかないようにする */
  exitRadiusM: 250,
  /** 測位の精度(誤差の半径)がこれより悪い測定は使わない */
  accuracyLimitM: 100,
  /** 同じ駅を次に回せるまでの時間 */
  cooldownMs: 20 * 60 * 1000,
  /** この距離ごとに、ノーマルの確率をスーパーレアへ移す */
  bonusStepM: 500,
  /** 1段階で移す確率(万分率。100 = 1%) */
  bonusPerStepBp: 100,
  /** 移す確率の上限(万分率。1500 = 15%。7.5km で到達) */
  bonusMaxBp: 1500,
  /** 起点からこれ未満の移動は数えない。2点の誤差の和のほうが大きければ、そちらを使う(止まっている間のGPSの揺れを除く) */
  minMoveM: 15,
  /** 位置をならすとき、新しい測位を混ぜる割合。小さいほど揺れに強いが、表示の追いつきが遅れる */
  smoothingWeight: 0.2,
  /** 駅ガチャの確率(万分率) */
  stationOddsBp: { NORMAL: 6000, RARE: 3000, SUPER_RARE: 1000 } satisfies Record<Rarity, number>,
  /** 持っているカードが出たときのかけら */
  shardsFor: { NORMAL: 1, RARE: 3, SUPER_RARE: 10 } satisfies Record<Rarity, number>,
};

export const RARITIES: Rarity[] = ['NORMAL', 'RARE', 'SUPER_RARE'];
export const RARITY_LABEL: Record<Rarity, string> = { NORMAL: 'ノーマル', RARE: 'レア', SUPER_RARE: 'スーパーレア' };
