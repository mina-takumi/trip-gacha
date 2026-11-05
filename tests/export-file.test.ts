import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exportOnWeb, isShareCanceled, type ShareNavigator } from '../src/export-file.ts';

function setup(nav: Partial<ShareNavigator>) {
  const shared: File[] = [];
  const downloaded: File[] = [];
  const base: ShareNavigator = {
    maxTouchPoints: 5,
    canShare: () => true,
    share: async ({ files }) => { shared.push(...files); },
    ...nav,
  };
  return { nav: base, shared, downloaded, download: (f: File) => { downloaded.push(f); } };
}

test('スマホでは共有画面に中身そのままのファイルを渡す', async () => {
  const s = setup({});
  await exportOnWeb('trip-gacha-2026-11-05.json', '{"a":1}', s.nav, s.download);
  assert.equal(s.downloaded.length, 0);
  assert.equal(s.shared[0].name, 'trip-gacha-2026-11-05.json');
  assert.equal(s.shared[0].type, 'application/json');
  assert.equal(await s.shared[0].text(), '{"a":1}');
});

test('パソコンではダウンロードにする', async () => {
  const s = setup({ maxTouchPoints: 0 });
  await exportOnWeb('a.json', '{}', s.nav, s.download);
  assert.equal(s.shared.length, 0);
  assert.equal(s.downloaded.length, 1);
});

test('ファイルを共有できないブラウザではダウンロードにする', async () => {
  const noCanShare = setup({ canShare: undefined });
  const refused = setup({ canShare: () => false });
  await exportOnWeb('a.json', '{}', noCanShare.nav, noCanShare.download);
  await exportOnWeb('a.json', '{}', refused.nav, refused.download);
  assert.equal(noCanShare.downloaded.length, 1);
  assert.equal(refused.downloaded.length, 1);
});

test('共有画面で本当に失敗したら呼び出し元へ伝える', async () => {
  const s = setup({ share: async () => { throw new Error('失敗'); } });
  await assert.rejects(exportOnWeb('a.json', '{}', s.nav, s.download), /失敗/);
});

test('「やめる」と失敗を見分ける', () => {
  assert.equal(isShareCanceled(new DOMException('canceled', 'AbortError')), true);
  assert.equal(isShareCanceled(new Error('Share canceled')), true);
  assert.equal(isShareCanceled(new Error('失敗')), false);
  assert.equal(isShareCanceled('Share canceled'), false);
});
