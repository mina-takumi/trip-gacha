import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPristine, mergeSaves, toRemoteJson } from '../src/cloud-merge.ts';
import { createCloudSync, type CloudApi, type CloudUser, type RemoteDoc } from '../src/cloud-sync.ts';
import { emptySave, parseSave, type SaveData } from '../src/store.ts';

const NOW = new Date(2026, 10, 24, 12, 0, 0).getTime();
const DAY = 24 * 60 * 60 * 1000;

const withCards = (cards: Record<string, [number, number]>, extra: Partial<SaveData> = {}): SaveData => ({
  ...emptySave(),
  collection: Object.fromEntries(Object.entries(cards).map(([id, [count, first]]) => [id, { count, firstAcquiredAt: first }])),
  totalSpins: Object.keys(cards).length,
  ...extra,
});

test('まだ遊んでいない新しい端末の空の記録は、サーバーの記録を消さない', () => {
  const remote = withCards({ a: [2, 100] }, { shards: 40, totalSpins: 5 });
  // 空の記録のほうが保存時刻が新しくても、サーバーの記録が残る
  const merged = mergeSaves(emptySave(), remote, NOW, NOW - DAY, NOW);
  assert.deepEqual(merged.collection, remote.collection);
  assert.equal(merged.shards, 40);
  assert.equal(merged.totalSpins, 5);
});

test('両方にあるカードは全部残し、数は多い方・初めて手に入れた日時は早い方', () => {
  const local = withCards({ a: [1, 500], b: [3, 200] });
  const remote = withCards({ a: [4, 300], c: [1, 900] });
  const m = mergeSaves(local, remote, NOW, NOW - 1000, NOW);
  assert.deepEqual(m.collection, { a: { count: 4, firstAcquiredAt: 300 }, b: { count: 3, firstAcquiredAt: 200 }, c: { count: 1, firstAcquiredAt: 900 } });
});

test('かけらと回した回数は、新しく保存した方の値', () => {
  const local = withCards({ a: [1, 1] }, { shards: 10, totalSpins: 7 });
  const remote = withCards({ a: [1, 1] }, { shards: 90, totalSpins: 12 });
  assert.equal(mergeSaves(local, remote, NOW, NOW - 1000, NOW).shards, 10);
  assert.equal(mergeSaves(local, remote, NOW - 1000, NOW, NOW).shards, 90);
  assert.equal(mergeSaves(local, remote, NOW - 1000, NOW, NOW).totalSpins, 12);
});

test('駅に寄った記録・回した記録・報酬・友達の駅は両方を足し合わせる', () => {
  const local = withCards({ a: [1, 1] }, {
    visitedAt: { s1: 100 }, visitedDistanceM: { s1: 500 }, spots: { s1: { lastSpunAt: 100, spinCount: 2 } },
    rewards: { 'line:x': 50 }, friendCards: { f1: 70 }, passedAt: { s1: 90 },
  });
  const remote = withCards({ a: [1, 1] }, {
    visitedAt: { s1: 200, s2: 50 }, visitedDistanceM: { s1: 900, s2: 10 }, spots: { s1: { lastSpunAt: 200, spinCount: 1 }, s2: { lastSpunAt: 60, spinCount: 1 } },
    rewards: { 'line:x': 30, 'city:y': 40 }, friendCards: { f1: 20, f2: 60 }, passedAt: { s1: 95 },
  });
  const m = mergeSaves(local, remote, NOW, NOW, NOW);
  assert.deepEqual(m.visitedAt, { s1: 200, s2: 50 });
  assert.deepEqual(m.visitedDistanceM, { s1: 900, s2: 10 });
  assert.deepEqual(m.spots, { s1: { lastSpunAt: 200, spinCount: 2 }, s2: { lastSpunAt: 60, spinCount: 1 } });
  assert.deepEqual(m.rewards, { 'line:x': 30, 'city:y': 40 });
  assert.deepEqual(m.friendCards, { f1: 20, f2: 60 });
  assert.deepEqual(m.passedAt, { s1: 95 });
});

test('日記は両方を足し、同じ時刻・同じ場所は1つ、残す日数より古いものは消す。同じ日のコメントは新しい方', () => {
  const old = NOW - 200 * DAY;
  const local = withCards({ a: [1, 1] }, {
    diary: [{ t: NOW - 1000, spotId: 'x' }, { t: old, spotId: 'x' }], diaryNotes: { '2026-11-24': 'ローカル', '2026-11-20': 'だけローカル' },
  });
  const remote = withCards({ a: [1, 1] }, {
    diary: [{ t: NOW - 1000, spotId: 'x' }, { t: NOW - 5000, spotId: 'y' }], diaryNotes: { '2026-11-24': 'サーバー', '2026-11-19': 'だけサーバー' },
  });
  const m = mergeSaves(local, remote, NOW, NOW - 10, NOW);
  assert.deepEqual(m.diary.map((e) => e.spotId), ['y', 'x']);
  assert.equal(m.diaryNotes['2026-11-24'], 'ローカル');
  assert.equal(m.diaryNotes['2026-11-20'], 'だけローカル');
  assert.equal(m.diaryNotes['2026-11-19'], 'だけサーバー');
  const m2 = mergeSaves(local, remote, NOW - 10, NOW, NOW);
  assert.equal(m2.diaryNotes['2026-11-24'], 'サーバー');
});

test('最後の位置・閉じている間の区間・今日の移動距離は、この端末のもの', () => {
  const local = withCards({ a: [1, 1] }, {
    lastFix: { lat: 35.6, lon: 139.3, t: 5, distanceM: 10 },
    walk: { dailyDistanceM: 1234, distanceDate: '2026-11-24', smooth: { lat: 1, lon: 2, accM: 3 }, anchor: null, lastFixAt: 9 },
  });
  const remote = withCards({ b: [1, 1] });
  const m = mergeSaves(local, remote, NOW, NOW - 1, NOW);
  assert.deepEqual(m.lastFix, local.lastFix);
  assert.deepEqual(m.walk, local.walk);
});

test('サーバーに置く文字には、位置そのもの(最後の位置・区間・ならした現在地)が入らない', () => {
  const s = withCards({ a: [1, 1] }, {
    lastFix: { lat: 35.65432, lon: 139.34567, t: 5, distanceM: 10 },
    pending: [{ from: { lat: 35.11111, lon: 139.22222, t: 1, distanceM: 0 }, to: { lat: 35.33333, lon: 139.44444, t: 2 }, addedM: 5 }],
    walk: { dailyDistanceM: 99, distanceDate: '2026-11-24', smooth: { lat: 35.55555, lon: 139.66666, accM: 3 }, anchor: { lat: 35.77777, lon: 139.88888, accM: 3 }, lastFixAt: 9 },
  });
  const json = toRemoteJson(s);
  for (const v of ['35.65432', '139.34567', '35.11111', '35.33333', '35.55555', '35.77777']) assert.ok(!json.includes(v), `${v} が入っている`);
  const back = parseSave(json);
  assert.equal(back.lastFix, null);
  assert.deepEqual(back.pending, []);
  assert.equal(back.walk.anchor, null);
  assert.equal(back.collection.a.count, 1);
});

test('何も遊んでいない記録だけが「空」。駅に寄っただけでは「遊んだ」に数えない', () => {
  assert.ok(isPristine(emptySave()));
  assert.ok(isPristine({ ...emptySave(), visitedAt: { s1: 1 }, visitedDistanceM: { s1: 0 }, passedAt: { s1: 1 } }));
  assert.ok(!isPristine(withCards({ a: [1, 1] })));
  assert.ok(!isPristine({ ...emptySave(), shards: 1 }));
  assert.ok(!isPristine({ ...emptySave(), friendCards: { f: 1 } }));
});

test('新しい端末を駅で開いて「寄った」だけの記録は、サーバーのかけらを消さない(保存時刻が新しくても)', () => {
  const visitOnly = { ...emptySave(), visitedAt: { s1: NOW }, visitedDistanceM: { s1: 0 } };
  const remote = withCards({ a: [1, 1] }, { shards: 80, totalSpins: 9, visitedAt: { s2: 5 } });
  const m = mergeSaves(visitOnly, remote, NOW, NOW - DAY, NOW);
  assert.equal(m.shards, 80);
  assert.equal(m.totalSpins, 9);
  assert.deepEqual(m.visitedAt, { s1: NOW, s2: 5 });
});

// ---------- 合わせる流れ ----------

function setup(opts: { remote?: RemoteDoc | null; local?: SaveData; savedAt?: number; pushFails?: boolean } = {}) {
  const calls: string[] = [];
  const pushed: RemoteDoc[] = [];
  let remote: RemoteDoc | null = opts.remote ?? null;
  let authCb: (u: CloudUser | null) => void = () => {};
  let save = opts.local ?? emptySave();
  let savedAt = opts.savedAt ?? 0;
  let changes = 0;
  const timers = new Map<number, () => void>();
  const waits: number[] = [];
  let timerSeq = 0;
  let now = NOW;
  const applied: SaveData[] = [];
  const api: CloudApi = {
    onAuth: (cb) => { authCb = cb; },
    signIn: () => { calls.push('signIn'); return Promise.resolve(); },
    signOut: async () => { calls.push('signOut'); authCb(null); },
    pull: async () => { calls.push('pull'); return remote; },
    push: async (_uid, doc) => {
      calls.push('push');
      if (opts.pushFails) throw new Error('offline');
      pushed.push(doc);
      remote = doc;
    },
    deleteAccount: async () => { calls.push('delete'); remote = null; },
  };
  const sync = createCloudSync({
    api,
    getSave: () => save,
    applySave: (s) => { save = s; applied.push(s); },
    getSavedAt: () => savedAt,
    setSavedAt: (t) => { savedAt = t; },
    now: () => now,
    timer: { set: (fn, ms) => { timers.set(++timerSeq, fn); waits.push(ms); return timerSeq; }, clear: (id) => { timers.delete(id); } },
    onChange: () => { changes++; },
    debounceMs: 10_000, minIntervalMs: 120_000, refreshMs: 30_000,
  });
  return {
    sync, calls, pushed, applied, timers, waits,
    get save() { return save; }, set save(s: SaveData) { save = s; },
    get savedAt() { return savedAt; }, get changes() { return changes; },
    setNow(t: number) { now = t; },
    login: async () => { authCb({ uid: 'u1', email: 'a@example.com' }); await sync.idle(); },
    fire: async () => { const fns = [...timers.values()]; timers.clear(); for (const f of fns) f(); await sync.idle(); },
  };
}

test('初めてのログイン: サーバーに記録がなく、遊んだ記録があれば、そのまま保存する', async () => {
  const t = setup({ local: withCards({ a: [1, 1] }) });
  t.sync.start();
  await t.login();
  assert.deepEqual(t.calls, ['pull', 'push']);
  assert.equal(t.pushed.length, 1);
  assert.ok(t.pushed[0].savedAt > 0);
  assert.equal(t.sync.view().state, 'ok');
  assert.equal(t.applied.length, 0);
});

test('初めてのログイン: まだ遊んでいない空の記録なら、何も保存しない', async () => {
  const t = setup();
  t.sync.start();
  await t.login();
  assert.deepEqual(t.calls, ['pull']);
  assert.equal(t.sync.view().state, 'ok');
});

test('新しい端末でログインすると、サーバーの記録が反映される(送り直さない)', async () => {
  const remoteSave = withCards({ a: [2, 5] }, { shards: 33 });
  const t = setup({ remote: { json: toRemoteJson(remoteSave), savedAt: NOW - DAY } });
  t.sync.start();
  await t.login();
  assert.equal(t.applied.length, 1);
  assert.equal(t.save.shards, 33);
  assert.deepEqual(t.calls, ['pull']);
  assert.equal(t.savedAt, NOW - DAY);
});

test('記録が変わると、少し待ってから合わせる。サーバーに置かない部分(位置)だけの変化では動かない', async () => {
  const t = setup({ local: withCards({ a: [1, 1] }), savedAt: NOW - 5 });
  t.sync.start();
  await t.login();
  t.calls.length = 0;
  // 位置だけが変わる
  t.save = { ...t.save, lastFix: { lat: 1, lon: 2, t: 3, distanceM: 4 } };
  t.sync.changed();
  assert.equal(t.timers.size, 0);
  // カードが増える
  t.save = { ...t.save, collection: { ...t.save.collection, b: { count: 1, firstAcquiredAt: 9 } } };
  t.setNow(NOW + 1000);
  t.sync.changed();
  assert.equal(t.timers.size, 1);
  assert.equal(t.savedAt, NOW + 1000);
  // 続けて変わっても、待ちは1つのまま
  t.sync.changed();
  assert.equal(t.timers.size, 1);
  await t.fire();
  assert.deepEqual(t.calls, ['pull', 'push']);
  assert.ok('b' in parseSave(t.pushed.at(-1)!.json).collection);
});

test('続けて合わせる間隔は下限より短くしない', async () => {
  const t = setup({ local: withCards({ a: [1, 1] }), savedAt: NOW - 5 });
  t.sync.start();
  await t.login();
  // 合わせ終えた20秒後に変わると、下限の2分のうち残りの100秒を待つ
  t.setNow(NOW + 20_000);
  t.save = { ...t.save, shards: 7 };
  t.sync.changed();
  assert.deepEqual(t.waits, [100_000]);
  // 十分たってから変われば、通常の待ち(10秒)
  const t2 = setup({ local: withCards({ a: [1, 1] }), savedAt: NOW - 5 });
  t2.sync.start();
  await t2.login();
  t2.setNow(NOW + 600_000);
  t2.save = { ...t2.save, shards: 7 };
  t2.sync.changed();
  assert.deepEqual(t2.waits, [10_000]);
});

test('他の端末で増えたカードは、こちらの保存で消えない。かけらは新しく保存した方', async () => {
  const mine = withCards({ a: [1, 1] }, { shards: 5 });
  const other = withCards({ a: [1, 1], b: [1, 2] }, { shards: 99 });
  const t = setup({ local: mine, savedAt: NOW + 5000, remote: { json: toRemoteJson(other), savedAt: NOW + 1000 } });
  t.sync.start();
  await t.login();
  assert.ok('b' in t.save.collection, '他の端末のカードが残る');
  assert.equal(t.save.shards, 5, 'この端末のほうが新しいので、かけらはこちら');
  assert.equal(t.pushed.length, 1);
  const sent = parseSave(t.pushed[0].json);
  assert.ok('b' in sent.collection && sent.shards === 5);
});

test('保存時刻が同じなら、かけら・回した回数はサーバーの値', () => {
  const local = withCards({ a: [1, 1] }, { shards: 48, totalSpins: 92 });
  const remote = withCards({ a: [1, 1] }, { shards: 455, totalSpins: 379 });
  const m = mergeSaves(local, remote, NOW, NOW, NOW);
  assert.equal(m.shards, 455);
  assert.equal(m.totalSpins, 379);
});

test('ログアウト中に古い記録を読み込んでログインしても、サーバーのかけら・回した回数が戻る', async () => {
  const server = withCards({ a: [1, 1], b: [2, 2] }, { shards: 455, totalSpins: 379 });
  const old = withCards({ a: [1, 1] }, { shards: 48, totalSpins: 92 });
  // この端末の保存時刻は、サーバーに送ったときのまま(読み込みでは進めない)
  const t = setup({ local: server, savedAt: NOW - 1000, remote: { json: toRemoteJson(server), savedAt: NOW - 1000 } });
  t.sync.start();
  await t.login();
  t.calls.length = 0;
  await t.sync.signOut();
  t.setNow(NOW);
  t.save = old;
  t.sync.changed({ keepSavedAt: true });
  assert.equal(t.savedAt, NOW - 1000, '読み込みでは保存時刻が進まない');
  await t.login();
  assert.equal(t.save.shards, 455);
  assert.equal(t.save.totalSpins, 379);
  assert.ok('b' in t.save.collection);
});

test('読み込みのあとに遊んで変わったら、その端末の値が新しい方になる', async () => {
  const server = withCards({ a: [1, 1] }, { shards: 455, totalSpins: 379 });
  const t = setup({ local: server, savedAt: NOW - 1000, remote: { json: toRemoteJson(server), savedAt: NOW - 1000 } });
  t.sync.start();
  await t.login();
  await t.sync.signOut();
  t.save = withCards({ a: [1, 1] }, { shards: 48, totalSpins: 92 });
  t.sync.changed({ keepSavedAt: true });
  t.setNow(NOW);
  t.save = { ...t.save, shards: 50 };
  t.sync.changed();
  assert.equal(t.savedAt, NOW);
  await t.login();
  assert.equal(t.save.shards, 50);
});

test('サーバーの記録が読めないときは、上書きも反映もしない', async () => {
  const t = setup({ local: withCards({ a: [1, 1] }), savedAt: 1, remote: { json: '{壊れている', savedAt: NOW } });
  t.sync.start();
  await t.login();
  assert.equal(t.sync.view().state, 'error');
  assert.match(t.sync.view().error ?? '', /読めませんでした/);
  assert.equal(t.pushed.length, 0);
  assert.equal(t.applied.length, 0);
});

test('送れなかったら、エラーにして、あとでやり直す', async () => {
  const t = setup({ local: withCards({ a: [1, 1] }), pushFails: true });
  t.sync.start();
  await t.login();
  assert.equal(t.sync.view().state, 'error');
  assert.equal(t.timers.size, 1);
});

test('ログインの小窓は、押した直後に開く(待たずに呼ぶ)', () => {
  const t = setup();
  void t.sync.signIn();
  assert.deepEqual(t.calls, ['signIn']);
});

test('サーバーの記録を消すと、ログアウトの状態になり、そのあと合わせない。端末の記録は残る', async () => {
  const mine = withCards({ a: [1, 1] });
  const t = setup({ local: mine, savedAt: 5 });
  t.sync.start();
  await t.login();
  await t.sync.deleteAll();
  assert.ok(t.calls.includes('delete'));
  assert.equal(t.sync.view().user, null);
  assert.deepEqual(t.save.collection, mine.collection);
  t.save = { ...t.save, shards: 3 };
  t.sync.changed();
  assert.equal(t.timers.size, 0);
});

test('ログアウトすると、そのあと合わせない', async () => {
  const t = setup({ local: withCards({ a: [1, 1] }), savedAt: 5 });
  t.sync.start();
  await t.login();
  await t.sync.signOut();
  t.save = { ...t.save, shards: 3 };
  t.sync.changed();
  assert.equal(t.timers.size, 0);
  assert.equal(t.sync.view().user, null);
});

test('画面を離れるときは待たずに合わせる。戻ったときは、間が空いていれば取り直す', async () => {
  const t = setup({ local: withCards({ a: [1, 1] }), savedAt: NOW - 100 });
  t.sync.start();
  await t.login();
  t.calls.length = 0;
  t.save = { ...t.save, shards: 4 };
  t.sync.changed();
  t.sync.flush();
  await t.sync.idle();
  assert.deepEqual(t.calls, ['pull', 'push']);
  // 30秒たたないうちは取り直さない
  t.calls.length = 0;
  t.setNow(NOW + 10_000);
  t.sync.refresh();
  await t.sync.idle();
  assert.deepEqual(t.calls, []);
  t.setNow(NOW + 60_000);
  t.sync.refresh();
  await t.sync.idle();
  assert.deepEqual(t.calls, ['pull']);
});
