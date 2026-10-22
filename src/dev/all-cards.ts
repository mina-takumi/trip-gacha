// 開発中だけ使う「全部集めた」記録。アドレスに ?all を付けて開くと、端末の記録の代わりにこれで表示する(端末には保存しない)。
import { RARITIES } from '../config.ts';
import { stationItemId } from '../gacha.ts';
import type { CommonCard, Spot } from '../items.ts';
import { emptySave, type SaveData } from '../store.ts';

export function allCardsSave(stations: Spot[], common: CommonCard[], now: number): SaveData {
  const ids = [...stations.flatMap((s) => RARITIES.map((r) => stationItemId(s.id, r))), ...common.map((c) => c.itemId)];
  return { ...emptySave(), collection: Object.fromEntries(ids.map((id) => [id, { count: 1, firstAcquiredAt: now }])), totalSpins: ids.length };
}
