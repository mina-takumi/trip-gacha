/** 画面に文字を入れるときに、< や & を記号として表示させる */
export const esc = (s: string | number): string =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const km = (m: number): string => (m / 1000).toFixed(1);

export const distanceLabel = (m: number): string => (m < 1000 ? `${Math.round(m / 10) * 10}m` : `${km(m)}km`);
