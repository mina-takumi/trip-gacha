/** 書き出しに使えるブラウザの機能だけを取り出したもの。テストでは偽物に差し替える */
export interface ShareNavigator {
  maxTouchPoints: number;
  canShare?(data: { files: File[] }): boolean;
  share?(data: { files: File[] }): Promise<void>;
}

/** 共有画面で「やめる」を押したとき。失敗ではないので何も知らせない */
export const isShareCanceled = (e: unknown): boolean =>
  e instanceof Error && (e.name === 'AbortError' || e.message === 'Share canceled');

/**
 * ブラウザで記録を書き出す。スマホでは共有画面を開き(「ファイルに保存」やAirDropを選べる)、
 * パソコンや共有できないブラウザではダウンロードにする。
 * 共有画面は押した直後でないと開けないので、ここまでの間で await しない
 */
export function exportOnWeb(name: string, text: string, nav: ShareNavigator, download: (file: File) => void): Promise<void> {
  const file = new File([text], name, { type: 'application/json' });
  if (nav.maxTouchPoints > 0 && nav.share && nav.canShare?.({ files: [file] })) return nav.share({ files: [file] });
  download(file);
  return Promise.resolve();
}
