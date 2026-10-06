// 開発中だけ使う位置シミュレーター。アドレスの最後に ?sim を付けて開くと、本物のGPSの代わりにこれを使う。
// 地図をクリック(タップ)した場所にいることにする。本物のGPSのように、1秒ごとに今の位置を送り続ける。
// 公開版(npm run build)には含まれない。
import type { LocationSource } from '../location.ts';

export function createSimLocation(start: { lat: number; lon: number }) {
  let pos = start;
  const source: LocationSource = {
    start(onFix) {
      const emit = () => onFix({ lat: pos.lat, lon: pos.lon, accuracyM: 5, t: Date.now() });
      emit();
      setInterval(emit, 1000);
    },
  };
  return {
    source,
    moveTo(lat: number, lon: number) {
      pos = { lat, lon };
    },
  };
}
