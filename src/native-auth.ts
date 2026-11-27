/** @capacitor-firebase/authentication のうち使う部分。テストでは偽物に差し替える */
export interface NativeAuthLike {
  signInWithGoogle(options: { skipNativeAuth: boolean }): Promise<{ credential: { idToken?: string; accessToken?: string } | null }>;
  signOut(): Promise<void>;
}

/**
 * アプリ版のGoogleログイン。アプリ内の画面でのログインは Google が禁止しているので、iPhone のログイン画面を出し、
 * 受け取った資格を返す(Firebase へのログインは呼ぶ側が JS で行う)
 */
export async function nativeGoogleTokens(plugin: NativeAuthLike): Promise<{ idToken: string; accessToken?: string }> {
  let result: Awaited<ReturnType<NativeAuthLike['signInWithGoogle']>>;
  try {
    result = await plugin.signInWithGoogle({ skipNativeAuth: true });
  } catch (e) {
    // 画面を閉じただけのときは、決まった番号が付かず文面だけが返る。PWAの「小窓を閉じた」と同じ扱いにする
    if (/cancell?ed/i.test(e instanceof Error ? e.message : String(e))) {
      throw Object.assign(new Error('ログインをやめました'), { code: 'auth/popup-closed-by-user' });
    }
    throw e;
  }
  const idToken = result.credential?.idToken;
  if (!idToken) throw new Error('Googleから資格を受け取れませんでした');
  return { idToken, accessToken: result.credential?.accessToken };
}
