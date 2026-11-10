import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openNativeStorage, type PreferencesLike } from '../src/native-storage.ts';
import { BACKGROUND_KEY, emptySave, exportJson, loadBackground, SAVE_KEY, saveBackground, storageAvailable, type StorageLike } from '../src/store.ts';

const good = exportJson({ ...emptySave(), shards: 7 });
const other = exportJson({ ...emptySave(), shards: 99 });

function fakeLocal(init: Record<string, string> = {}): StorageLike & { data: Map<string, string> } {
  const data = new Map(Object.entries(init));
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) };
}

function fakePrefs(init: Record<string, string> = {}) {
  const data = new Map(Object.entries(init));
  const log: string[] = [];
  const prefs: PreferencesLike = {
    get: async ({ key }) => ({ value: data.get(key) ?? null }),
    set: async ({ key, value }) => { log.push(`set ${key}`); data.set(key, value); },
    remove: async ({ key }) => { log.push(`remove ${key}`); data.delete(key); },
  };
  return { prefs, data, log };
}

const tick = () => new Promise((r) => setTimeout(r));

test('初回は localStorage から写し、元の記録は残す', async () => {
  const local = fakeLocal({ [SAVE_KEY]: good });
  const p = fakePrefs();
  const s = await openNativeStorage(p.prefs, local);
  assert.equal(s.getItem(SAVE_KEY), good);
  assert.equal(p.data.get(SAVE_KEY), good);
  assert.equal(local.data.get(SAVE_KEY), good);
});

test('Preferences に記録があれば、そちらを使い localStorage は変えない', async () => {
  const local = fakeLocal({ [SAVE_KEY]: other });
  const p = fakePrefs({ [SAVE_KEY]: good });
  const s = await openNativeStorage(p.prefs, local);
  assert.equal(s.getItem(SAVE_KEY), good);
  assert.deepEqual(p.log, []);
  s.setItem(SAVE_KEY, good);
  await tick();
  assert.equal(local.data.get(SAVE_KEY), other);
});

test('どちらにも記録がなければ空のまま始め、何も書かない', async () => {
  const p = fakePrefs();
  const s = await openNativeStorage(p.prefs, fakeLocal());
  assert.equal(s.getItem(SAVE_KEY), null);
  assert.deepEqual(p.log, []);
});

test('Preferences が読めなければ localStorage をそのまま使い、上書きしない', async () => {
  const local = fakeLocal({ [SAVE_KEY]: good });
  const p = fakePrefs();
  p.prefs.get = async () => { throw new Error('読めない'); };
  assert.equal(await openNativeStorage(p.prefs, local), local);
  assert.deepEqual(p.log, []);
});

test('Preferences の記録が壊れていれば localStorage を使い、壊れた記録も上書きしない', async () => {
  const local = fakeLocal({ [SAVE_KEY]: good });
  const p = fakePrefs({ [SAVE_KEY]: '{壊れている' });
  assert.equal(await openNativeStorage(p.prefs, local), local);
  assert.equal(p.data.get(SAVE_KEY), '{壊れている');
});

test('写せなければ localStorage を使う', async () => {
  const local = fakeLocal({ [SAVE_KEY]: good });
  const p = fakePrefs();
  p.prefs.set = async () => { throw new Error('書けない'); };
  assert.equal(await openNativeStorage(p.prefs, local), local);
});

test('localStorage の記録が壊れていれば写さない', async () => {
  const local = fakeLocal({ [SAVE_KEY]: '{壊れている' });
  const p = fakePrefs();
  assert.equal(await openNativeStorage(p.prefs, local), local);
  assert.deepEqual(p.log, []);
});

test('書くとすぐ読めて、Preferences にも届く', async () => {
  const p = fakePrefs();
  const s = await openNativeStorage(p.prefs, fakeLocal());
  s.setItem(SAVE_KEY, good);
  assert.equal(s.getItem(SAVE_KEY), good);
  await tick();
  assert.equal(p.data.get(SAVE_KEY), good);
});

test('送っている間に続けて書いても、順に送り、最後の中身が残る', async () => {
  const p = fakePrefs();
  const s = await openNativeStorage(p.prefs, fakeLocal());
  const sent: string[] = [];
  let finish = () => {};
  p.prefs.set = ({ value }) => new Promise((resolve) => {
    sent.push(value);
    finish = () => { p.data.set(SAVE_KEY, value); resolve(); };
  });
  s.setItem(SAVE_KEY, '1');
  s.setItem(SAVE_KEY, '2');
  s.setItem(SAVE_KEY, '3');
  assert.deepEqual(sent, ['1']);
  finish();
  await tick();
  assert.deepEqual(sent, ['1', '3']);
  finish();
  await tick();
  assert.equal(p.data.get(SAVE_KEY), '3');
});

test('書けなくても止まらず、次に書いたときにまた送る', async () => {
  const p = fakePrefs();
  const s = await openNativeStorage(p.prefs, fakeLocal());
  const realSet = p.prefs.set;
  p.prefs.set = async () => { throw new Error('書けない'); };
  s.setItem(SAVE_KEY, good);
  await tick();
  assert.equal(s.getItem(SAVE_KEY), good);
  p.prefs.set = realSet;
  s.setItem(SAVE_KEY, other);
  await tick();
  assert.equal(p.data.get(SAVE_KEY), other);
});

test('保存できるかの確かめは、試しの項目を残さない', async () => {
  const p = fakePrefs();
  const s = await openNativeStorage(p.prefs, fakeLocal());
  assert.equal(storageAvailable(s), true);
  await tick();
  assert.equal(p.data.size, 0);
});

test('閉じている間の記録は最初はオンで、オフにすると次の起動でもオフ', async () => {
  const p = fakePrefs();
  const s = await openNativeStorage(p.prefs, fakeLocal());
  assert.equal(loadBackground(s), true);
  saveBackground(s, false);
  await tick();
  assert.equal(p.data.get(BACKGROUND_KEY), 'off');
  assert.equal(loadBackground(await openNativeStorage(p.prefs, fakeLocal())), false);
  saveBackground(s, true);
  await tick();
  assert.equal(loadBackground(await openNativeStorage(p.prefs, fakeLocal())), true);
});
