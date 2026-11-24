import type { CloudApi } from './cloud-sync.ts';

/** Firebase の設定の値。公開してよい値(他人の記録を守るのは firestore.rules) */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDFvuFqBBITAE83S9Qe1sLlYkKqu-xSAC0',
  authDomain: 'trip-gacha-7399b.firebaseapp.com',
  projectId: 'trip-gacha-7399b',
  appId: '1:571285245204:web:21c0ea2b6f1cf24137c601',
};

/** ログインの案内(ホームページとプライバシーポリシー)の置き場所 */
export const POLICY_URL = 'https://trip-gacha-7399b.web.app/privacy.html';

/**
 * ログインを出すのは、公開しているこの場所と、開発中の ?cloud だけ。
 * GitHub Pages の版は Firebase の許可するドメインに入れていないので出さない
 */
export const cloudEnabled = location.hostname === 'trip-gacha.pages.dev'
  || (import.meta.env.DEV && new URLSearchParams(location.search).has('cloud'));

/** Firebase の部品は大きいので、使うときに読み込む。ログインの小窓は押した直後に開く必要があるため、起動時に先に読んでおく */
export async function openFirebase(): Promise<CloudApi> {
  const [{ initializeApp }, auth, store] = await Promise.all([
    import('firebase/app'), import('firebase/auth'), import('firebase/firestore/lite'),
  ]);
  const app = initializeApp(FIREBASE_CONFIG);
  const a = auth.getAuth(app);
  const db = store.getFirestore(app);
  const docRef = (uid: string) => store.doc(db, 'users', uid);
  const provider = () => {
    const p = new auth.GoogleAuthProvider();
    // 前に選んだアカウントが自動で選ばれないよう、毎回選ばせる
    p.setCustomParameters({ prompt: 'select_account' });
    return p;
  };

  return {
    onAuth: (cb) => { auth.onAuthStateChanged(a, (u) => cb(u ? { uid: u.uid, email: u.email } : null)); },
    signIn: async () => { await auth.signInWithPopup(a, provider()); },
    signOut: async () => { await auth.signOut(a); },
    async pull(uid) {
      const snap = await store.getDoc(docRef(uid));
      if (!snap.exists()) return null;
      const d = snap.data();
      if (typeof d.json !== 'string' || typeof d.savedAt !== 'number') throw new Error('サーバーの記録の形が違います');
      return { json: d.json, savedAt: d.savedAt };
    },
    async push(uid, doc) {
      await store.setDoc(docRef(uid), { json: doc.json, savedAt: doc.savedAt, v: 1 });
    },
    async deleteAccount(uid) {
      const u = a.currentUser;
      if (!u || u.uid !== uid) throw new Error('ログインしていません');
      // アカウントを消すには、直前にログインし直している必要がある(小窓を最初に開く)
      await auth.reauthenticateWithPopup(u, provider());
      try {
        await store.deleteDoc(docRef(uid));
        await auth.deleteUser(u);
      } finally {
        // 記録を消したあとにログインのまま残ると、次の保存で記録が作り直されてしまう
        await auth.signOut(a).catch(() => {});
      }
    },
  };
}
