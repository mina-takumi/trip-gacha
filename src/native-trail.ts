import type { TrailFiles } from './trail.ts';

const DIR = 'trail';
const path = (month: string) => `${DIR}/${month}.txt`;

/** 歩いた道の月ごとのファイルを、アプリ専用のフォルダ(Filesystem の Data)に置く */
export async function openTrailFiles(): Promise<TrailFiles> {
  const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
  const directory = Directory.Data, encoding = Encoding.UTF8;
  return {
    async months() {
      const { files } = await Filesystem.readdir({ path: DIR, directory });
      return files.map((f) => f.name.match(/^(\d{4}-\d{2})\.txt$/)?.[1]).filter((m): m is string => !!m);
    },
    async read(month) {
      const { data } = await Filesystem.readFile({ path: path(month), directory, encoding });
      return typeof data === 'string' ? data : await data.text();
    },
    async write(month, text) {
      await Filesystem.writeFile({ path: path(month), data: text, directory, encoding, recursive: true });
    },
    async append(month, text) {
      await Filesystem.appendFile({ path: path(month), data: text, directory, encoding });
    },
  };
}
