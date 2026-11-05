/** アプリ版の書き出し。アプリの中ではダウンロードが使えないので、一時ファイルにしてiPhoneの共有画面へ渡す */
export async function exportOnNative(name: string, text: string): Promise<void> {
  const [{ Filesystem, Directory, Encoding }, { Share }] = await Promise.all([import('@capacitor/filesystem'), import('@capacitor/share')]);
  const { uri } = await Filesystem.writeFile({ path: name, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 });
  await Share.share({ title: name, files: [uri] });
}
