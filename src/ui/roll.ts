/** 距離の数字を桁ごとに回すときの計算(画面には触らない) */

/** 桁ごとの周回数。右の桁から順に。足りない桁は最後の値 */
const TURNS = [5, 3, 2];

export interface RollDigit {
  /** 上から順に並べる字。最初の字から最後の字まで送る */
  seq: string[];
  /** 右から数えて何桁目か(0 が右端) */
  fromRight: number;
}
export type RollCell = RollDigit | '.';

/** 右端をそろえて、from の字を to の字に対応させる。足りない桁は空白 */
function alignedDigit(from: string, to: string, i: number): string {
  const c = from[from.length - to.length + i];
  return c === undefined ? ' ' : c;
}

/**
 * from から to へ回す計画。long なら全部の桁を何周か回す(開いたとき)。long でなければ変わった桁だけ送る(歩いて増えたとき)。
 * 数字は必ず増える向きに回す(日付が変わって 12.4 → 0.0 になるときも、9 の次の 0 へ進む)
 */
export function rollPlan(from: string, to: string, long: boolean): RollCell[] {
  const digitsRight = [...to].filter((c) => c !== '.').length - 1;
  let seen = 0;
  return [...to].map((c, i) => {
    if (c === '.') return '.';
    const fromRight = digitsRight - seen++;
    const start = alignedDigit(from, to, i);
    const f = /\d/.test(start) ? Number(start) : 0;
    const t = Number(c);
    const steps = (long ? (TURNS[fromRight] ?? TURNS[TURNS.length - 1]) * 10 : 0) + ((t - f + 10) % 10);
    const seq = Array.from({ length: steps + 1 }, (_, k) => String((f + k) % 10));
    if (steps > 0 && !/\d/.test(start)) seq[0] = ' ';
    return { seq, fromRight };
  });
}

/** 止まっている数字。回っている途中と同じ幅になるよう、桁ごとに箱へ入れる */
export const digitsHtml = (text: string): string => [...text]
  .map((c) => (c === '.' ? '<i class="p">.</i>' : `<span class="d"><b>${c}</b></span>`)).join('');

export const rollHtml = (cells: RollCell[]): string => cells
  .map((c) => (c === '.' ? '<i class="p">.</i>' : `<span class="d"><span class="strip">${c.seq.map((s) => `<b>${s}</b>`).join('')}</span></span>`)).join('');
