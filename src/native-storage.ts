import { BACKGROUND_KEY, parseSave, SAVE_KEY, SAVED_AT_KEY, CLOUD_ASK_KEY, type StorageLike } from './store.ts';

export interface PreferencesLike {
  get(options: { key: string }): Promise<{ value: string | null }>;
  set(options: { key: string; value: string }): Promise<void>;
  remove(options: { key: string }): Promise<void>;
}

/**
 * アプリ版の記録の置き場所。iPhoneは空き容量が減ると localStorage を消すことがあるので、Preferences に置く。
 * Preferences は読み書きに待ち時間があるので、起動時に読んで手元に持ち、書くときは手元を直してから順に送る。
 * 最初の1回は localStorage から写す(元の記録は残す)。読めなければ localStorage をそのまま使い、空の記録で上書きしない
 */
export async function openNativeStorage(prefs: PreferencesLike, local: StorageLike): Promise<StorageLike> {
  const memory = new Map<string, string>();
  try {
    const stored = (await prefs.get({ key: SAVE_KEY })).value;
    const text = stored ?? local.getItem(SAVE_KEY);
    if (text != null) {
      parseSave(text);
      if (stored == null) await prefs.set({ key: SAVE_KEY, value: text });
      memory.set(SAVE_KEY, text);
    }
    const background = (await prefs.get({ key: BACKGROUND_KEY })).value;
    if (background != null) memory.set(BACKGROUND_KEY, background);
    // 記録と同じ場所に置く。保存時刻だけ消えると、端末の新しい記録がサーバーの古い値に負ける
    const savedAt = (await prefs.get({ key: SAVED_AT_KEY })).value;
    if (savedAt != null) memory.set(SAVED_AT_KEY, savedAt);
    // 残す記録を選ぶ途中で閉じたら、次に開いたときもまた聞く
    const ask = (await prefs.get({ key: CLOUD_ASK_KEY })).value;
    if (ask != null) memory.set(CLOUD_ASK_KEY, ask);
  } catch {
    return local;
  }

  // 同じ項目を続けて書いたときは、送っている間にたまった分の最新だけを送る。null は消す
  const waiting = new Map<string, string | null>();
  let sending = false;
  async function send(): Promise<void> {
    if (sending) return;
    sending = true;
    for (const [key, value] of waiting) {
      waiting.delete(key);
      try {
        await (value == null ? prefs.remove({ key }) : prefs.set({ key, value }));
      } catch {
        // 保存できなくても遊びは続ける。次に書くときにまた送る
      }
    }
    sending = false;
  }

  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem(key, value) {
      memory.set(key, value);
      waiting.set(key, value);
      void send();
    },
    removeItem(key) {
      memory.delete(key);
      waiting.set(key, null);
      void send();
    },
  };
}
