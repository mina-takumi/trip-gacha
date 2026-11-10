# フォルダとファイルの説明

トリップガチャのプロジェクトフォルダに何が入っているかの一覧。2026-11-10 時点(枝 `feature/ios-app`、版 0.8.2)。

「公開」の列は、GitHub のリポジトリに入っている(人から見える)かどうか。「いいえ」は手元だけにあるもの。

## 一番上の階層

| 名前 | 公開 | 説明 |
|---|---|---|
| `index.html` | はい | アプリの入り口のページ。中身は `src/main.ts` が組み立てる |
| `package.json` | はい | アプリの名前・版・使う部品の一覧と、`npm run ◯◯` で動かせるコマンドの一覧 |
| `package-lock.json` | はい | 部品の正確な版を固定する記録。手で直さない |
| `tsconfig.json` | はい | TypeScript(プログラムの言語)の設定 |
| `vite.config.ts` | はい | Vite(開発用の画面表示と公開用の組み立て)の設定。電波がなくても動くようにする設定もここ |
| `capacitor.config.json` | はい | iPhoneアプリ版の設定(アプリの名前・ID、どのフォルダを中身にするか) |
| `.gitignore` | はい | GitHub に送らないファイルの一覧 |
| `FILES.md` | — | このファイル |
| `trip-gacha.ipa` | いいえ | iPhoneアプリ版の最新の本体(Sideloadly でiPhoneへ入れる) |
| `trip-gacha-0.8.1.ipa` | いいえ | 1つ前(0.8.1)のiPhoneアプリ版 |

## フォルダ

| フォルダ | 公開 | 説明 |
|---|---|---|
| `src/` | はい | アプリ本体のプログラム |
| `tests/` | はい | 自動テスト(`npm test`) |
| `scripts/` | はい | データや絵を作るための道具 |
| `data/` | はい | 駅・バス停・地図・路線の元データ |
| `public/` | はい | そのまま配る絵・アイコン・地図・道のデータ |
| `docs/` | 一部 | カードの名前の一覧と、絵を作るときの指示書 |
| `ios/` | はい | iPhoneアプリ版を作るためのXcodeのプロジェクト |
| `.github/workflows/` | はい | GitHub で自動で動く手順(公開・iPhoneアプリの組み立て) |
| `mockups/` | はい | 見た目を決めるために作った見本 |
| `.claude/` | 一部 | Claude Code の設定 |
| `old/` | いいえ | TypeScript に移す前の古いプログラムの控え |
| `node_modules/` | いいえ | 部品の置き場所。`npm install` で入れ直せる |
| `dist/` | いいえ | 公開用に組み立てた結果。`npm run build` で作り直せる |

## src/ アプリ本体

| ファイル | 説明 |
|---|---|
| `main.ts` | アプリ全体のまとめ役。位置を受け取り、記録を読み書きし、画面を切り替える |
| `config.ts` | 遊びながら調整する数値(範囲200m・待ち時間20分・確率・GPSの間隔など)。ここだけ直せば全体に効く |
| `geofence.ts` | 駅・バス停の200m以内に入ったか出たかの判定と、2点の距離の計算 |
| `walk.ts` | その日の移動距離の計算。GPSの揺れで止まっていても増えないように、位置をならして足す |
| `location.ts` | ブラウザでの位置の取り方。速さに合わせて15秒ごと・5秒ごと・測り続けるを切り替える |
| `gacha.ts` | ガチャの確率と抽選。駅は移動距離で珍しいカードが出やすくなる |
| `items.ts` | カードの名前と絵のファイル名を、番号から決まった形で作る(同じ場所では毎回同じカード) |
| `store.ts` | 記録(持っているカード・かけら・回す権利など)の形と、読み書き・書き出しの処理 |
| `route.ts` | 閉じている間に通った道すじの推測(歩き・バス・電車)と、通過した駅・バス停の判定 |
| `export-file.ts` | 書き出しの方法を選ぶ(パソコンはダウンロード、スマホのブラウザは共有画面) |
| `native-location.ts` | iPhoneアプリ版での位置の受け取り(閉じている間も受け取れる) |
| `native-storage.ts` | iPhoneアプリ版での記録の置き場所(Preferences)。初回に前の置き場所から写す |
| `native-export.ts` | iPhoneアプリ版での書き出し(一時ファイルにして共有画面へ) |
| `style.css` | 画面の見た目(色・書体・形) |
| `ui/screens.ts` | ホーム・結果・図鑑・地図・設定・注意事項などの画面の中身 |
| `ui/card.ts` | カード1枚の見た目 |
| `ui/map.ts` | 地図画面(市の形・道路・駅・バス停・範囲の輪) |
| `ui/fx.ts` | 起動のスタンプや回すときのカプセルの演出 |
| `ui/roll.ts` | 距離の数字を桁ごとに回すときの計算 |
| `ui/icons.ts` | 線画のアイコン |
| `ui/html.ts` | 画面に文字を入れるときの小さな道具 |
| `dev/sim.ts` | 開発中だけ使う位置シミュレーター(アドレスに `?sim`)。公開版には入らない |
| `dev/all-cards.ts` | 開発中だけ使う「全部集めた」記録(アドレスに `?all`)。公開版には入らない |

## tests/ 自動テスト

`npm test` でまとめて動く。ファイル名は、確かめる相手の `src/` のファイル名に合わせてある(例: `gacha.test.ts` は `gacha.ts` を確かめる)。

| ファイル | 確かめること |
|---|---|
| `gacha.test.ts` | 確率と抽選 |
| `geofence.test.ts` | 範囲に入った・出たの判定 |
| `walk.test.ts` | 移動距離(止まっていると増えないかなど) |
| `location.test.ts` | 位置の取り方の切り替え |
| `items.test.ts` | カードの名前 |
| `store.test.ts` | 記録の読み書き・書き出し・読み込み |
| `route.test.ts` | 道すじの推測 |
| `pass.test.ts` | 閉じている間の通過で回す権利が付くか |
| `roll.test.ts` | 距離の数字の回り方 |
| `export-file.test.ts` | 書き出しの方法の選び方 |
| `native-location.test.ts` | アプリ版の位置の受け取り |
| `native-storage.test.ts` | アプリ版の記録の置き場所と写し方 |
| `helpers.ts` | テスト用の道具(決まった順に出る乱数など) |

## scripts/ データや絵を作る道具

ふだんアプリを動かすときには使わない。元データを取り直したり、絵を入れ替えたりするときだけ動かす。

| ファイル | コマンド | 説明 |
|---|---|---|
| `build-spots.mjs` | `node scripts/build-spots.mjs` | 停留所の一覧を整理して `data/spots.json` を作る(同じ名前の近いバス停を1つにまとめる) |
| `copy-art.mjs` | `npm run art` | 卒業制作フォルダのカードの絵を英字の名前で `public/art/` にコピーし、小さくする |
| `export-card-names.mjs` | `npm run names:check` | カードの名前の一覧を `docs/` に書き出す。`--check` で名前が変わっていないか確かめる |
| `export-art-prompts.mjs` | `node scripts/export-art-prompts.mjs` | 絵を作るときの指示書を `docs/` に書き出す |
| `fetch-roads.mjs` | `npm run map:roads` | OpenStreetMap から道路を取る(通信する) |
| `fetch-neighbors.mjs` | `node scripts/fetch-neighbors.mjs` | OpenStreetMap から日野・町田・多摩の形と駅を取る(通信する) |
| `fetch-transit.mjs` | `npm run route:fetch` | OpenStreetMap からバス路線と電車の路線を取る(通信する) |
| `neighbor-map.mjs` | — | 周りの市を地図に描くための下ごしらえ。下の2つから使われる |
| `build-map-data.mjs` | `npm run map:data` | アプリの地図画面のデータ(`public/map/`)を作る |
| `build-map.mjs` | `npm run map` | 八王子の簡略地図の見本(`mockups/map-v1-retro.html`)を作る |
| `build-route-data.mjs` | `npm run route:data` | 道すじの推測に使うデータ(`public/route/`)を作る |
| `route-accuracy.mjs` | `npm run route:check` | 道すじの推測がどれくらい当たるかを測る |

## data/ 元データ

| ファイル | 説明 |
|---|---|
| `spots.json` | アプリが使う駅・バス停の一覧(`build-spots.mjs` が作る) |
| `source/SOURCE.md` | 元データの出典とライセンス(OpenStreetMap、ODbL) |
| `source/hachioji_stops.csv` | 八王子の駅・バス停の元の一覧 |
| `source/hachioji_boundary.json` | 八王子市の形 |
| `source/hachioji_roads.json` | 八王子市の主な道路 |
| `source/hachioji_roads_all.json` | 八王子市のすべての道路(住宅街の道・歩道も) |
| `source/neighbors.json` | 日野・町田・多摩の形と駅 |
| `source/neighbors_roads.json` | 3市の主な道路 |
| `source/neighbors_roads_all.json` | 3市のすべての道路 |
| `source/bus_routes.json` | バス路線 |
| `source/rail_routes.json` | 電車の路線(停車駅の順) |

## public/ そのまま配るもの

| フォルダ | 説明 |
|---|---|
| `art/special/` | 駅カードの絵(45枚) |
| `art/bus/` | バス停カードの絵(120枚) |
| `art/secret/` | 公開しないカードの絵 |
| `icons/` | ホーム画面のアイコン |
| `map/` | 地図画面のデータ。`base.json` は最初に読む市の形と主な道路、`detail.json` は拡大したときに読む細い道 |
| `route/` | 道すじの推測のデータ。`roads.json` は道のつながり、`transit.json` はバス路線と電車の駅のつながり |

## docs/ 資料

| ファイル | 公開 | 説明 |
|---|---|---|
| `card-names.md` | はい | 駅カードとバス停カードの名前の一覧(確定版。手で直さない) |
| `illustration-prompts.md` | はい | 八王子の駅カードとバス停カードの絵を作るときの指示書 |
| `illustration-prompts-neighbors.md` | はい | 日野・町田・多摩の駅カードの絵の指示書 |
| `*-secret.md` | いいえ | 公開しない資料(`.gitignore` で外している) |

## ios/ iPhoneアプリ版

Capacitor(Webのアプリを iPhoneアプリに包む道具)が作ったXcodeのプロジェクト。ふだん手で直すのは次の1つくらい。

| ファイル | 説明 |
|---|---|
| `App/App/Info.plist` | アプリの設定。位置情報の許可を求めるときの文や、閉じている間も位置を受け取る設定 |

`App/App/public/` には組み立てたアプリの中身が写される(GitHub の組み立てで作り直されるので、手で直さない)。

## .github/workflows/ 自動で動く手順

| ファイル | いつ動くか | 説明 |
|---|---|---|
| `deploy.yml` | main に送ったとき | テスト → 組み立て → GitHub Pages と Cloudflare Pages に公開 |
| `build-ios.yml` | 枝 `feature/ios-app` に送ったとき | テスト → iPhoneアプリ版(IPA)を組み立てる。署名はしないので、Sideloadly で署名して入れる |

## mockups/ 見本

画面や地図の見た目を決めるときに作った試し。アプリ本体からは使っていない。

| ファイル | 説明 |
|---|---|
| `ui-v1.html`・`ui-v2-c-colors.html`・`ui-v3-retro.html` | 画面の見た目の案。今の見た目は `ui-v3-retro.html`(レトロ × 手作り感) |
| `rarity-tint.html` | 珍しさごとのカードの色味の試し |
| `map-v1-retro*.html`・`.png` | 八王子の簡略地図の見本 |
| `map-illust-*.html`・`.png` | 地図の描き方の試し(路線・バスの範囲・周りの市など) |
| `app-map-neighbors*.jpg` | 周りの市を足した地図画面の画像 |
| `img/` | 見本で使う絵 |

## .claude/ Claude Code の設定

| ファイル | 公開 | 説明 |
|---|---|---|
| `launch.json` | はい | Claude Code から開発用サーバーを立てる設定 |
| `settings.local.json` | いいえ | この手元だけの Claude Code の許可設定 |
