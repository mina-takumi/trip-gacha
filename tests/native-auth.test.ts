import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nativeGoogleTokens, type NativeAuthLike } from '../src/native-auth.ts';

const plugin = (signInWithGoogle: NativeAuthLike['signInWithGoogle']): NativeAuthLike => ({ signInWithGoogle, signOut: async () => {} });

test('iPhoneのログイン画面は skipNativeAuth で開き、受け取った資格を返す', async () => {
  let asked: unknown;
  const tokens = await nativeGoogleTokens(plugin(async (o) => { asked = o; return { credential: { idToken: 'i', accessToken: 'a' } }; }));
  assert.deepEqual(asked, { skipNativeAuth: true });
  assert.deepEqual(tokens, { idToken: 'i', accessToken: 'a' });
});

test('ログイン画面を閉じたときは、小窓を閉じたのと同じ扱いにする', async () => {
  await assert.rejects(
    nativeGoogleTokens(plugin(async () => { throw new Error('The user canceled the sign-in flow.'); })),
    { code: 'auth/popup-closed-by-user' },
  );
});

test('ほかの失敗はそのまま伝え、資格が無ければ失敗にする', async () => {
  await assert.rejects(nativeGoogleTokens(plugin(async () => { throw new Error('keychain error'); })), /keychain error/);
  await assert.rejects(nativeGoogleTokens(plugin(async () => ({ credential: null }))), /資格/);
});
