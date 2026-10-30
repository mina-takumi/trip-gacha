import type { Rarity } from './items.ts';

// 遊びながら調整する数値。ここだけ直せば全体に効く
export const CONFIG = {
  /** この距離以内に入ったら回せる */
  enterRadiusM: 200,
  /** この距離より外に出たら一覧から消える。入る距離と分けて、境目でちらつかないようにする */
  exitRadiusM: 250,
  /** 測位の精度(誤差の半径)がこれより悪い測定は使わない */
  accuracyLimitM: 100,
  /** 止まっている・歩いているとき(gpsMediumKmh 未満)に位置を取りに行く間隔。GPSを休ませて電池を持たせる */
  gpsSlowIntervalMs: 15_000,
  /** 自転車ほどの速さ(gpsMediumKmh 以上 gpsFastKmh 未満)のときに位置を取りに行く間隔 */
  gpsMediumIntervalMs: 5_000,
  gpsMediumKmh: 10,
  /** この時速以上(電車・バス)は測り続ける。範囲の端をかすめても取りこぼさないように */
  gpsFastKmh: 40,
  /** 測り続けている間は、この時速未満が gpsLeaveFastAfterMs 続いてから取りに行く方式に戻す */
  gpsLeaveFastKmh: 30,
  gpsLeaveFastAfterMs: 20_000,
  /** 同じ駅を次に回せるまでの時間 */
  cooldownMs: 20 * 60 * 1000,
  /** この距離ごとに、ノーマルの確率をスーパーレアへ移す */
  bonusStepM: 1000,
  /** 1段階で移す確率(万分率。100 = 1%) */
  bonusPerStepBp: 100,
  /** 移す確率の上限(万分率。1500 = 15%。15km で到達) */
  bonusMaxBp: 1500,
  /** 起点からこれ未満の移動は数えない。2点の誤差の和のほうが大きければ、そちらを使う(止まっている間のGPSの揺れを除く) */
  minMoveM: 15,
  /** 位置をならすとき、1秒ごとの測位で新しい測位を混ぜる割合。小さいほど揺れに強いが、表示の追いつきが遅れる。間隔が長いほど多く混ぜる */
  smoothingWeight: 0.2,
  /** 混ぜる割合の上限。15秒ごとの測位でも、止まっている間の揺れを抑えるため */
  smoothingWeightMax: 0.5,
  /** 前の測位からこれ以上空いたら(画面を消していたなど)、ならさず新しい位置をそのまま使う */
  smoothingResetAfterMs: 60_000,
  /** 駅ガチャの確率(万分率) */
  stationOddsBp: { NORMAL: 6000, RARE: 3000, SUPER_RARE: 1000 } satisfies Record<Rarity, number>,
  /** バス停ガチャの確率(万分率)。出たレア度の中から、共通のカードを1枚選ぶ */
  busOddsBp: { NORMAL: 7000, RARE: 2500, SUPER_RARE: 500 } satisfies Record<Rarity, number>,
  /** 持っているカードが出たときのかけら */
  shardsFor: { NORMAL: 1, RARE: 3, SUPER_RARE: 10 } satisfies Record<Rarity, number>,
  /** 裏カードが出る確率(百万分率。100 = 0.01%)。バス停で回したときだけ。移動距離では変わらない */
  secretBasePpm: 100,
  /** かけら1個ごとに足す確率(百万分率。1 = 0.0001%) */
  secretPerShardPpm: 1,
  /** 裏カードの確率の上限(百万分率。2000 = 0.2%。かけら1900個で到達) */
  secretMaxPpm: 2000,
  /** 行ったことのある駅のガチャを、かけらで1回回すときに使う数 */
  shardSpinCost: 300,

  // ---- 閉じている間の通過(前に開いていた最後の位置と、開き直した位置の間の道すじを推測する) ----
  /** 前の位置からこれ以上たち、passMinMoveM 以上離れて開き直したら推測する(開いたまま歩いている間は15秒ごとに位置が来るので動かない) */
  passMinGapMs: 2 * 60 * 1000,
  passMinMoveM: 300,
  /** 測ってからこれより時間がたった位置は、区間の端に使わない(開き直した直後に届く、閉じる前の位置) */
  passFreshMs: 60 * 1000,
  /** 道すじから、この距離以内の駅・バス停を通過にする */
  passNearM: 200,
  /** 候補ごとにかかる最短の時間の目安。バス・電車は待ち時間を足し、乗り場までは歩き */
  passWalkKmh: 4,
  passBusKmh: 15,
  passBusWaitMs: 10 * 60 * 1000,
  passTrainKmh: 40,
  passTrainWaitMs: 10 * 60 * 1000,
  /** これより速くは移動できない、という上限(走る・快速電車も入るように速めに)。かかった時間がこれで足りない候補は使えない */
  passWalkMaxKmh: 8,
  passBusMaxKmh: 40,
  passTrainMaxKmh: 90,
  /** 選べる候補が2つ以上でも、通過する場所がこの割合以上同じなら聞かずに歩きに近いほうを使う */
  passSameRatio: 0.8,
  /** かかった時間が「(ふつうの時間 − passFitSlackMs) ÷ passFitFactor」から「ふつうの時間 × passFitFactor + passFitSlackMs」までなら、その候補に合う */
  passFitFactor: 1.5,
  passFitSlackMs: 10 * 60 * 1000,
  /** 出発地・到着地から道までがこれより遠ければ、その道は使えない */
  passSnapM: 300,
  /** バス路線が出発地・到着地のこの距離以内を通れば、その路線に乗れたとみなす */
  passBusLineM: 400,
  /** 出発地・到着地からこの距離以内の駅に歩いて行けるとみなす(電車の候補) */
  passStationWalkM: 1500,
  /** 道すじが出ないときは、バス停の回す権利を直線距離1kmあたりこの回数、1区間で passCountMax 回まで */
  passCountPerKm: 4,
  passCountMax: 10,
};

export const RARITIES: Rarity[] = ['NORMAL', 'RARE', 'SUPER_RARE'];
export const RARITY_LABEL: Record<Rarity, string> = { NORMAL: 'ノーマル', RARE: 'レア', SUPER_RARE: 'スーパーレア' };
