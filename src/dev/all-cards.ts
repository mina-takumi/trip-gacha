// 開発中だけ使う「全部集めた」記録。アドレスに ?all を付けて開くと、端末の記録の代わりにこれで表示する(端末には保存しない)。
import { RARITIES } from '../config.ts';
import { stationItemId } from '../gacha.ts';
import type { Catalog, CommonCard, Spot } from '../items.ts';
import { emptySave, type SaveData } from '../store.ts';

/** 裏カードはバス停で出るもの全部(24種)。手に入れた順に並ぶので、少しずつ時刻をずらす */
export function allCardsSave(stations: Spot[], common: CommonCard[], busStops: Spot[], catalog: Catalog, now: number): SaveData {
  const secrets = new Set(busStops.map((s) => catalog.secretAt(s.id)));
  const ids = [...stations.flatMap((s) => RARITIES.map((r) => stationItemId(s.id, r))), ...common.map((c) => c.itemId), ...secrets];
  return { ...emptySave(), collection: Object.fromEntries(ids.map((id, i) => [id, { count: 1, firstAcquiredAt: now + i }])), totalSpins: ids.length };
}
