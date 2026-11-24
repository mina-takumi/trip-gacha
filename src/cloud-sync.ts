import { isPristine, mergeSaves, toRemoteJson } from './cloud-merge.ts';
import { parseSave, type SaveData } from './store.ts';

export interface CloudUser { uid: string; email: string | null }
export interface RemoteDoc { json: string; savedAt: number }

/** サーバーとログインの道具。本物は cloud.ts(Firebase)、テストでは偽物に差し替える */
export interface CloudApi {
  /** ログインの状態が変わったとき(最初に前回のログインが戻ったときも)呼ばれる */
  onAuth(cb: (user: CloudUser | null) => void): void;
  /** ログインの小窓を開く。押した直後に呼ばないと、ブラウザに止められる */
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  pull(uid: string): Promise<RemoteDoc | null>;
  push(uid: string, doc: RemoteDoc): Promise<void>;
  /** サーバーの記録とアカウントを消す(ログインし直しの小窓を開くので、押した直後に呼ぶ) */
  deleteAccount(uid: string): Promise<void>;
}

export interface SyncView {
  user: CloudUser | null;
  state: 'idle' | 'syncing' | 'ok' | 'error';
  /** 最後にサーバーと合わせ終えた時刻(epoch ミリ秒) */
  syncedAt: number | null;
  error: string | null;
}

export interface SyncDeps {
  api: CloudApi;
  getSave(): SaveData;
  /** 合わせた記録をアプリに反映して端末に保存する */
  applySave(save: SaveData): void;
  /** この端末の記録を最後に変えた時刻。新しい方を選ぶのに使う。無ければ 0 */
  getSavedAt(): number;
  setSavedAt(t: number): void;
  now(): number;
  timer: { set(fn: () => void, ms: number): number; clear(id: number): void };
  onChange(): void;
  /** 変えてから送るまでの待ち(ms)と、続けて送る間隔の下限(ms) */
  debounceMs: number;
  minIntervalMs: number;
  /** 前回から、戻ったときに取り直すまでの下限(ms) */
  refreshMs: number;
}

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

/**
 * 任意のログインで、記録をサーバーに保存する。端末の中の記録が本体で、サーバーは写し。
 * 送る前に必ずサーバーの記録を取って合わせる(他の端末の変更を、こちらの保存で消さないため)
 */
export function createCloudSync(deps: SyncDeps) {
  const { api } = deps;
  let user: CloudUser | null = null;
  let state: SyncView['state'] = 'idle';
  let syncedAt: number | null = null;
  let error: string | null = null;
  let lastJson = toRemoteJson(deps.getSave());
  let timerId = 0;
  let lastSyncAt = -Infinity;
  let queue: Promise<void> = Promise.resolve();
  let deleting = false;

  const set = (s: SyncView['state'], err: string | null = null) => { state = s; error = err; deps.onChange(); };
  const enqueue = (job: () => Promise<void>) => { queue = queue.then(job, job); return queue; };

  async function sync(): Promise<void> {
    if (!user || deleting) return;
    const uid = user.uid;
    set('syncing');
    try {
      const remote = await api.pull(uid);
      const local = deps.getSave();
      let merged = local;
      let savedAt = deps.getSavedAt();
      let needPush = false;
      if (remote) {
        let remoteSave: SaveData;
        try {
          remoteSave = parseSave(remote.json);
        } catch (e) {
          // サーバーの記録が読めないときは、上書きしない
          throw new Error(`サーバーの記録を読めませんでした(${message(e)})`);
        }
        merged = mergeSaves(local, remoteSave, savedAt, remote.savedAt, deps.now());
        savedAt = Math.max(savedAt, remote.savedAt);
        needPush = toRemoteJson(merged) !== remote.json;
      } else {
        needPush = !isPristine(local);
      }
      if (savedAt === 0 && !isPristine(merged)) savedAt = deps.now();
      if (toRemoteJson(merged) !== toRemoteJson(local)) {
        // 反映のための保存で「変わった」と数えないよう、先に覚える
        lastJson = toRemoteJson(merged);
        deps.applySave(merged);
      }
      deps.setSavedAt(savedAt);
      if (needPush) await api.push(uid, { json: toRemoteJson(merged), savedAt });
      lastSyncAt = deps.now();
      syncedAt = lastSyncAt;
      set('ok');
    } catch (e) {
      lastSyncAt = deps.now();
      set('error', message(e));
      schedule();
    }
  }

  function schedule(): void {
    if (timerId || !user) return;
    const wait = Math.max(deps.debounceMs, lastSyncAt + deps.minIntervalMs - deps.now());
    timerId = deps.timer.set(() => { timerId = 0; void enqueue(sync); }, wait);
  }

  return {
    /** 起動時に呼ぶ。前回のログインが残っていれば、すぐ合わせる */
    start(): void {
      api.onAuth((u) => {
        user = u;
        if (u) void enqueue(sync);
        else { syncedAt = null; set('idle'); }
        deps.onChange();
      });
    },
    view(): SyncView { return { user, state, syncedAt, error }; },
    /** ログインの小窓を開く(最初の行で呼ぶこと) */
    signIn(): Promise<void> {
      return api.signIn();
    },
    async signOut(): Promise<void> {
      await api.signOut();
    },
    /** サーバーの記録とアカウントを消す。端末の中の記録は残る */
    async deleteAll(): Promise<void> {
      if (!user) return;
      const uid = user.uid;
      deleting = true;
      if (timerId) { deps.timer.clear(timerId); timerId = 0; }
      try {
        await api.deleteAccount(uid);
        user = null;
        syncedAt = null;
        set('idle');
      } catch (e) {
        set('error', message(e));
        throw e;
      } finally {
        deleting = false;
      }
    },
    /** 端末の記録を保存するたびに呼ぶ。サーバーに置く部分が変わったときだけ、少し待ってから合わせる */
    changed(): void {
      const json = toRemoteJson(deps.getSave());
      if (json === lastJson) return;
      lastJson = json;
      deps.setSavedAt(deps.now());
      schedule();
    },
    /** 画面を閉じるとき・戻ったとき・通信が戻ったとき。変更があれば今すぐ、なければ間が空いていれば取り直す */
    flush(): void {
      if (!user) return;
      if (timerId) { deps.timer.clear(timerId); timerId = 0; void enqueue(sync); }
    },
    refresh(): void {
      if (!user || timerId) return;
      if (deps.now() - lastSyncAt >= deps.refreshMs) void enqueue(sync);
    },
    /** テスト用: 進行中の処理が終わるまで待つ */
    idle(): Promise<void> { return queue; },
  };
}

export type CloudSync = ReturnType<typeof createCloudSync>;
