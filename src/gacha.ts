import { CONFIG, RARITIES } from './config.ts';
import type { Rarity } from './items.ts';

export type Odds = Record<Rarity, number>;

/** その日の移動距離で、ノーマルの確率の一部をスーパーレアへ移す。レアは変えない。確率は万分率 */
export function oddsFor(base: Odds, distanceM: number): Odds {
  const steps = Math.floor(Math.max(0, distanceM) / CONFIG.bonusStepM);
  const shift = Math.min(steps * CONFIG.bonusPerStepBp, CONFIG.bonusMaxBp);
  return { NORMAL: base.NORMAL - shift, RARE: base.RARE, SUPER_RARE: base.SUPER_RARE + shift };
}

/** 次に確率が上がるまでの距離。上限に達していれば null */
export function metersToNextStep(distanceM: number): number | null {
  const maxM = (CONFIG.bonusMaxBp / CONFIG.bonusPerStepBp) * CONFIG.bonusStepM;
  if (distanceM >= maxM) return null;
  return CONFIG.bonusStepM - (Math.max(0, distanceM) % CONFIG.bonusStepM);
}

/** rand は 0 以上 1 未満を返す関数(テストでは決まった値を渡す) */
export function drawRarity(odds: Odds, rand: () => number): Rarity {
  const total = RARITIES.reduce((sum, r) => sum + odds[r], 0);
  let x = rand() * total;
  for (const r of RARITIES) {
    if (x < odds[r]) return r;
    x -= odds[r];
  }
  return 'NORMAL';
}

export const stationItemId = (spotId: string, rarity: Rarity) => `station:${spotId}:${rarity}`;
