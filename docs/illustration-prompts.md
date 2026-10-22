<!-- このファイルは scripts/export-art-prompts.mjs が src/items.ts から自動で作る。手で編集しない。 -->

# イラスト指示書(SeaArt AI 用)

カードの真ん中の図柄 144枚ぶんの指示。枠・ローマ数字・名前はアプリ側で描くので、絵には入れない。

## 使い方

1. **モデルを選ぶ**: 下の「まず試す3枚」を、候補のモデル2〜3個で作ってみて、3枚の絵柄が一番そろうモデルに決める
2. **モデルの利用条件を確かめる**: モデルごとに、作った絵の公開や利用についての条件が決まっている。将来ほかの人に配る予定なので、公開してよいモデルか必ず確かめる
3. **設定を記録する**: 決めたモデルと設定を下の「記録欄」に書く。全カードを同じモデル・同じ設定で作る。途中で日が空いても、ここを見て同じ条件で再開する
4. **画像の大きさは必ず正方形(1024 × 1024)にする**: 縦長にすると、AIがタロットカード1枚の形を思い浮かべ、枠・番号・名前の帯まで描いてしまう
5. **1枚ずつ作る**: 各カードの枠の中の英文を「プロンプト」欄に、「描いてほしくないこと」を「ネガティブプロンプト」欄に貼る
6. **保存する**: 書いてあるファイル名で保存し、このフォルダの `art/bus/` か `art/special/` に置く

共通の指示の部分(各英文の後半)は1文字も変えないこと。変えると絵柄がそろわなくなる。

## 絵柄の決まりごと

| 項目 | 決まりごと |
|---|---|
| 様式 | アール・デコ風。直線・円・放射状の線の幾何学的な飾り、左右対称 |
| 線 | 落ち着いた金。太さは中くらいでそろえる(スマホで小さく表示しても消えないように)。陰影は付けない |
| 塗り | 特別カードは輪郭線だけの指示(実際は金で塗られた絵になった)。バス停カードは平らな塗りでよい |
| 色の修飾 | 銀・白・紅・蒼は物全体をその色にする |
| 背景 | ほぼ黒に近い無地の濃紺。模様や質感は付けない(「夜明けの」「真夜中の」のカードだけ背景が変わる) |
| 構図 | 真正面から見た形で中央に。物は大きく |
| バス停カード | 物が主役で1つだけ。後ろの飾りは描かない(放射状の線は縦の線や円になった)。指示文は短く(約75語以内)。長いと後ろに書いた言葉が効かない |
| 特別カード | 太陽光線のような放射状の飾り・階段状の模様・かすかな光の輪。バス停カードより豪華にして特別感を出す |
| 金の修飾 | 「金の」カードだけ、物をいつもの落ち着いた金ではなく強く輝く金にする |

## 記録欄

| 項目 | 値 |
|---|---|
| モデル名 | |
| モデルの利用条件を確認した日 | |
| 画像の大きさ | 1024 × 1024(正方形) |
| サンプラー | |
| ステップ数 | |
| CFG | |
| シード | (1つの値に固定して全カード同じにする) |

## 描いてほしくないこと(ネガティブプロンプト欄に貼る)

### 特別カード用

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed
```

### バス停カード用

特別カード用より短くしたもの。このカードだけの禁止があるカードは、各カードの下に先頭へ足した文を書いてある。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

## まず試す3枚

色の修飾・効果の修飾・特別カードを1枚ずつ。この3枚が並べて同じシリーズに見えるモデルを選ぶ。

### XLIII 蒼い月

保存するファイル名: `art/bus/moon-azure.png` / 意味: 月(物全体が蒼色)

```
single azure blue crescent moon, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely azure blue, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden moon, craters, dripping, stars, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XLI 燃える鍵

保存するファイル名: `art/bus/key-burning.png` / 意味: 鍵(炎に包まれている)

```
single warm muted gold antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XIV 京王八王子の灯台

保存するファイル名: `art/special/lighthouse.png` / 意味: 灯台(特別カード。装飾多め・後ろに光の輪)

```
single lighthouse, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

## バス停カードの試し(8枚)

指示文が長すぎて後ろの言葉が効いていなかったため、バス停カードの指示を短くした(2026-10-09)。作ってあったバス停カードもすべてこの指示で作り直す。120枚を作る前に、修飾の種類ごとに1枚ずつ、この8枚で試す。

### XV 黒い冠

保存するファイル名: `art/bus/crown-black.png` / 意味: 冠(黒く塗った物、ふちだけ金)

```
single matte black crown, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, painted solid black with a thin gold edge, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden crown, person, human figure, hood, cloak, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XLII 稲妻の錨

保存するファイル名: `art/bus/anchor-lightning.png` / 意味: 錨(稲妻が走る)

```
single warm muted gold anchor, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, crackling with stylized lightning bolts around it, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XII 水晶の鍵

保存するファイル名: `art/bus/key-crystal.png` / 意味: 鍵(透き通った水晶でできている)

```
single clear crystal antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, made of transparent faceted crystal, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden antique key, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### V 夜明けの炎

保存するファイル名: `art/bus/flame-dawn.png` / 意味: 炎(背景の下4分の1が朝焼けの橙)

```
single warm muted gold flame, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXI 真夜中の星

保存するファイル名: `art/bus/star-midnight.png` / 意味: 星(背景が濃紺の夜空、白く小さな星)

```
single warm muted gold star, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, deep navy night sky background with many tiny white dots of light, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
brown background, orange background, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CXVI 鎖の剣

保存するファイル名: `art/bus/sword-chained.png` / 意味: 剣(太い鎖が巻きつく)

```
single warm muted gold sword, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, wrapped tightly in a heavy chain, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XLI 燃える鍵

保存するファイル名: `art/bus/key-burning.png` / 意味: 鍵(炎に包まれている)

```
single warm muted gold antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXIII 翠の鍵

保存するファイル名: `art/bus/key-emerald.png` / 意味: 鍵(物全体が翠色)

```
single emerald green antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden antique key, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

## 作り直すカード(3枚)

何度作っても名前の物が描かれなかったカード。4回目は、形のたとえに使った物(チェスの駒・金管楽器・立っている人)が描かれたため、たとえを外して物そのものだけで説明し直し、描かれた物を「描いてほしくないこと」に足している。角笛は描けなかったため、物を鎌(長い柄の大鎌)に差し替えた。下の特別カードの一覧にも同じ内容が入っている。

### X 八王子の指輪

保存するファイル名: `art/special/ring.png` / 意味: 指輪(特別カード。装飾多め・後ろに光の輪)

```
single diamond ring, a piece of jewelry, a plain gold ring band with one large faceted diamond set on top, the diamond ring is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, hand, fingers, person, human figure, silhouette, cloak, hood, glossy, shiny reflections, realistic metal
```

### XXI 京王堀之内の印章

保存するファイル名: `art/special/seal.png` / 意味: 印章(特別カード。装飾多め・後ろに光の輪)

```
single ink stamp, an old ink stamp tool, a short wooden handle on top and a square stamp block at the bottom with an engraved flat face, the ink stamp is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, chess piece, chess king, crown, glossy, shiny reflections, realistic metal
```

### 特別カード(鎌)

保存するファイル名: `art/special/scythe.png` / 意味: 鎌(特別カード。装飾多め・後ろに光の輪)

```
single scythe, a long straight wooden pole standing vertically with a large curved steel blade attached at the top, the blade sweeping out to one side, a small grip in the middle of the pole, the scythe is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, person, human figure, grim reaper, skeleton, skull, hood, cloak, hand, crescent moon, sickle, glossy, shiny reflections, realistic metal
```

## 特別カード(24枚)

装飾を少し増やし、後ろにかすかな光の輪を描く。

### 0 八王子みなみ野の門

保存するファイル名: `art/special/gate.png` / 意味: 門(特別カード。装飾多め・後ろに光の輪)

```
single ornate gate, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### I 片倉の羅針盤

保存するファイル名: `art/special/compass.png` / 意味: 羅針盤(特別カード。装飾多め・後ろに光の輪)

```
single compass, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XII 高尾の旗

保存するファイル名: `art/special/banner.png` / 意味: 旗(特別カード。装飾多め・後ろに光の輪)

```
single banner flag, a waving banner flag hanging from a tall vertical pole, the banner flag is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### XIV 京王八王子の灯台

保存するファイル名: `art/special/lighthouse.png` / 意味: 灯台(特別カード。装飾多め・後ろに光の輪)

```
single lighthouse, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### II 狭間の橋

保存するファイル名: `art/special/bridge.png` / 意味: 橋(特別カード。装飾多め・後ろに光の輪)

```
single arched bridge, a stone arch bridge with one large arch spanning from left to right, the arched bridge is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### III めじろ台の船

保存するファイル名: `art/special/ship.png` / 意味: 船(特別カード。装飾多め・後ろに光の輪)

```
single sailing ship, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XIX 北野の燭台

保存するファイル名: `art/special/candlestick.png` / 意味: 燭台(特別カード。装飾多め・後ろに光の輪)

```
single candlestick with a candle, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XV 中央大学・明星大学の竪琴

保存するファイル名: `art/special/harp.png` / 意味: 竪琴(特別カード。装飾多め・後ろに光の輪)

```
single harp, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XVI 大塚・帝京大学の書

保存するファイル名: `art/special/book.png` / 意味: 書(特別カード。装飾多め・後ろに光の輪)

```
single open book, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XI 西八王子の巻物

保存するファイル名: `art/special/scroll.png` / 意味: 巻物(特別カード。装飾多め・後ろに光の輪)

```
single scroll, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XVIII 長沼の松明

保存するファイル名: `art/special/torch.png` / 意味: 松明(特別カード。装飾多め・後ろに光の輪)

```
single torch, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XVII 松が谷の泉

保存するファイル名: `art/special/fountain.png` / 意味: 泉(特別カード。装飾多め・後ろに光の輪)

```
single fountain, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### VIII 清滝の樹

保存するファイル名: `art/special/tree.png` / 意味: 樹(特別カード。装飾多め・後ろに光の輪)

```
single tree, a single large tree with a thick trunk, spreading branches and a round leafy crown, the tree is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### V 京王片倉の山

保存するファイル名: `art/special/mountain.png` / 意味: 山(特別カード。装飾多め・後ろに光の輪)

```
single mountain, a single large triangular mountain peak with a snow cap and clear slopes, the mountain is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### IV 山田の階段

保存するファイル名: `art/special/staircase.png` / 意味: 階段(特別カード。装飾多め・後ろに光の輪)

```
single staircase, a straight flight of stone steps rising upward, seen from the front, the staircase is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### IX 高尾山の窓

保存するファイル名: `art/special/window.png` / 意味: 窓(特別カード。装飾多め・後ろに光の輪)

```
single arched window, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XIII 高尾山口の歯車

保存するファイル名: `art/special/gear.png` / 意味: 歯車(特別カード。装飾多め・後ろに光の輪)

```
single gear, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### VII 小宮の風車

保存するファイル名: `art/special/windmill.png` / 意味: 風車(特別カード。装飾多め・後ろに光の輪)

```
single windmill, a traditional windmill tower with four large cross-shaped sails, the windmill is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### VI 北八王子の仮面

保存するファイル名: `art/special/mask.png` / 意味: 仮面(特別カード。装飾多め・後ろに光の輪)

```
single mask, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### X 八王子の指輪

保存するファイル名: `art/special/ring.png` / 意味: 指輪(特別カード。装飾多め・後ろに光の輪)

```
single diamond ring, a piece of jewelry, a plain gold ring band with one large faceted diamond set on top, the diamond ring is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, hand, fingers, person, human figure, silhouette, cloak, hood, glossy, shiny reflections, realistic metal
```

### XX 南大沢の宝珠

保存するファイル名: `art/special/orb.png` / 意味: 宝珠(特別カード。装飾多め・後ろに光の輪)

```
single orb, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXI 京王堀之内の印章

保存するファイル名: `art/special/seal.png` / 意味: 印章(特別カード。装飾多め・後ろに光の輪)

```
single ink stamp, an old ink stamp tool, a short wooden handle on top and a square stamp block at the bottom with an engraved flat face, the ink stamp is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, chess piece, chess king, crown, glossy, shiny reflections, realistic metal
```

### 特別カード(鎌)

保存するファイル名: `art/special/scythe.png` / 意味: 鎌(特別カード。装飾多め・後ろに光の輪)

```
single scythe, a long straight wooden pole standing vertically with a large curved steel blade attached at the top, the blade sweeping out to one side, a small grip in the middle of the pole, the scythe is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, person, human figure, grim reaper, skeleton, skull, hood, cloak, hand, crescent moon, sickle, glossy, shiny reflections, realistic metal
```

### 特別カード(天球儀)

保存するファイル名: `art/special/armillary.png` / 意味: 天球儀(特別カード。装飾多め・後ろに光の輪)

```
single armillary sphere, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

## バス停カード(120枚)

### I 水晶の扉

保存するファイル名: `art/bus/door-crystal.png` / 意味: 扉(透き通った水晶でできている)

```
single clear crystal tall arched door with two panels, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, made of transparent faceted crystal, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden arched door, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### II 金の星

保存するファイル名: `art/bus/star-gold.png` / 意味: 星(物がいつもより強く輝く金)

```
single radiant bright gold star, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, strong golden glow, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### III 翼ある炎

保存するファイル名: `art/bus/flame-winged.png` / 意味: 炎(翼が生えている)

```
single warm muted gold flame, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, with a pair of feathered wings, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### IV 銀の羽

保存するファイル名: `art/bus/feather-silver.png` / 意味: 羽(物全体が銀色)

```
single silver feather, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely silver, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden feather, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### V 夜明けの炎

保存するファイル名: `art/bus/flame-dawn.png` / 意味: 炎(背景の下4分の1が朝焼けの橙)

```
single warm muted gold flame, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### VI 銀の冠

保存するファイル名: `art/bus/crown-silver.png` / 意味: 冠(物全体が銀色)

```
single silver crown, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely silver, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden crown, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### VII 紅い雫

保存するファイル名: `art/bus/droplet-crimson.png` / 意味: 雫(物全体が紅色)

```
single crimson red teardrop-shaped water droplet, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely crimson red, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden water droplet, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### VIII 紅い目

保存するファイル名: `art/bus/eye-crimson.png` / 意味: 目(物全体が紅色)

```
single crimson red open almond-shaped eye with a round iris, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely crimson red, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden eye, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### IX 逆さの剣

保存するファイル名: `art/bus/sword-inverted.png` / 意味: 剣(上下逆さま)

```
single warm muted gold sword, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, upside down, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### X 金の月

保存するファイル名: `art/bus/moon-gold.png` / 意味: 月(物がいつもより強く輝く金)

```
single radiant bright gold crescent moon, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, strong golden glow, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
craters, dripping, stars, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XI 翼ある冠

保存するファイル名: `art/bus/crown-winged.png` / 意味: 冠(翼が生えている)

```
single warm muted gold crown, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, with a pair of feathered wings, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XII 水晶の鍵

保存するファイル名: `art/bus/key-crystal.png` / 意味: 鍵(透き通った水晶でできている)

```
single clear crystal antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, made of transparent faceted crystal, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden antique key, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XIII 蒼い扉

保存するファイル名: `art/bus/door-azure.png` / 意味: 扉(物全体が蒼色)

```
single azure blue tall arched door with two panels, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely azure blue, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden arched door, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XIV 稲妻の鍵

保存するファイル名: `art/bus/key-lightning.png` / 意味: 鍵(稲妻が走る)

```
single warm muted gold antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, crackling with stylized lightning bolts around it, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XV 黒い冠

保存するファイル名: `art/bus/crown-black.png` / 意味: 冠(黒く塗った物、ふちだけ金)

```
single matte black crown, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, painted solid black with a thin gold edge, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden crown, person, human figure, hood, cloak, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XVI 夜明けの剣

保存するファイル名: `art/bus/sword-dawn.png` / 意味: 剣(背景の下4分の1が朝焼けの橙)

```
single warm muted gold sword, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XVII 翠の扉

保存するファイル名: `art/bus/door-emerald.png` / 意味: 扉(物全体が翠色)

```
single emerald green tall arched door with two panels, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden arched door, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XVIII 真夜中の天秤

保存するファイル名: `art/bus/scales-midnight.png` / 意味: 天秤(背景が濃紺の夜空、白く小さな星)

```
single warm muted gold balance scale with exactly two hanging pans, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, deep navy night sky background with many tiny white stars, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
brown background, orange background, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XIX 逆さの杖

保存するファイル名: `art/bus/wand-inverted.png` / 意味: 杖(上下逆さま)

```
single warm muted gold magic staff, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, upside down, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XX 凍てる矢

保存するファイル名: `art/bus/arrow-frozen.png` / 意味: 矢(霜の結晶に覆われている)

```
single warm muted gold arrow, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, frozen, covered in frost crystals, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXI 真夜中の星

保存するファイル名: `art/bus/star-midnight.png` / 意味: 星(背景が濃紺の夜空、白く小さな星)

```
single warm muted gold star, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, deep navy night sky background with many tiny white dots of light, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
brown background, orange background, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXII 夜明けの灯

保存するファイル名: `art/bus/lantern-dawn.png` / 意味: 灯(背景の下4分の1が朝焼けの橙)

```
single warm muted gold lantern, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXIII 翠の鍵

保存するファイル名: `art/bus/key-emerald.png` / 意味: 鍵(物全体が翠色)

```
single emerald green antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden antique key, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXIV 燃える輪

保存するファイル名: `art/bus/wheel-burning.png` / 意味: 輪(炎に包まれている)

```
single warm muted gold spoked wagon wheel, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXV 鎖の錨

保存するファイル名: `art/bus/anchor-chained.png` / 意味: 錨(太い鎖が巻きつく)

```
single warm muted gold anchor, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, wrapped tightly in a heavy chain, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXVI 燃える錨

保存するファイル名: `art/bus/anchor-burning.png` / 意味: 錨(炎に包まれている)

```
single warm muted gold anchor, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXVII 黒い羽

保存するファイル名: `art/bus/feather-black.png` / 意味: 羽(黒く塗った物、ふちだけ金)

```
single matte black feather, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, painted solid black with a thin gold edge, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden feather, person, human figure, hood, cloak, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXVIII 金の灯

保存するファイル名: `art/bus/lantern-gold.png` / 意味: 灯(物がいつもより強く輝く金)

```
single radiant bright gold lantern, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, strong golden glow, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXIX 金の杯

保存するファイル名: `art/bus/chalice-gold.png` / 意味: 杯(物がいつもより強く輝く金)

```
single radiant bright gold chalice, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, strong golden glow, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXX 燃える杖

保存するファイル名: `art/bus/wand-burning.png` / 意味: 杖(炎に包まれている)

```
single warm muted gold magic staff, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXXI 凍てる天秤

保存するファイル名: `art/bus/scales-frozen.png` / 意味: 天秤(霜の結晶に覆われている)

```
single warm muted gold balance scale with exactly two hanging pans, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, frozen, covered in frost crystals, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXXII 銀の砂時計

保存するファイル名: `art/bus/hourglass-silver.png` / 意味: 砂時計(物全体が銀色)

```
single silver hourglass, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely silver, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden hourglass, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXXIII 逆さの太陽

保存するファイル名: `art/bus/sun-inverted.png` / 意味: 太陽(上下逆さま)

```
single warm muted gold sun, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, upside down, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXXIV 翠の杯

保存するファイル名: `art/bus/chalice-emerald.png` / 意味: 杯(物全体が翠色)

```
single emerald green chalice, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden chalice, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXXV 稲妻の鐘

保存するファイル名: `art/bus/bell-lightning.png` / 意味: 鐘(稲妻が走る)

```
single warm muted gold bell, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, crackling with stylized lightning bolts around it, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXXVI 蒼い鐘

保存するファイル名: `art/bus/bell-azure.png` / 意味: 鐘(物全体が蒼色)

```
single azure blue bell, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely azure blue, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden bell, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXXVII 鎖の天秤

保存するファイル名: `art/bus/scales-chained.png` / 意味: 天秤(太い鎖が巻きつく)

```
single warm muted gold balance scale with exactly two hanging pans, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, wrapped tightly in a heavy chain, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XXXVIII 翠の鐘

保存するファイル名: `art/bus/bell-emerald.png` / 意味: 鐘(物全体が翠色)

```
single emerald green bell, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden bell, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XXXIX 燃える扉

保存するファイル名: `art/bus/door-burning.png` / 意味: 扉(炎に包まれている)

```
single warm muted gold tall arched door with two panels, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XL 黒い砂時計

保存するファイル名: `art/bus/hourglass-black.png` / 意味: 砂時計(黒く塗った物、ふちだけ金)

```
single matte black hourglass, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, painted solid black with a thin gold edge, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden hourglass, person, human figure, hood, cloak, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XLI 燃える鍵

保存するファイル名: `art/bus/key-burning.png` / 意味: 鍵(炎に包まれている)

```
single warm muted gold antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XLII 稲妻の錨

保存するファイル名: `art/bus/anchor-lightning.png` / 意味: 錨(稲妻が走る)

```
single warm muted gold anchor, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, crackling with stylized lightning bolts around it, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XLIII 蒼い月

保存するファイル名: `art/bus/moon-azure.png` / 意味: 月(物全体が蒼色)

```
single azure blue crescent moon, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely azure blue, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden moon, craters, dripping, stars, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XLIV 銀の雫

保存するファイル名: `art/bus/droplet-silver.png` / 意味: 雫(物全体が銀色)

```
single silver teardrop-shaped water droplet, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely silver, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden water droplet, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XLV 稲妻の輪

保存するファイル名: `art/bus/wheel-lightning.png` / 意味: 輪(稲妻が走る)

```
single warm muted gold spoked wagon wheel, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, crackling with stylized lightning bolts around it, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XLVI 翼ある矢

保存するファイル名: `art/bus/arrow-winged.png` / 意味: 矢(翼が生えている)

```
single warm muted gold arrow, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, with a pair of feathered wings, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XLVII 逆さの輪

保存するファイル名: `art/bus/wheel-inverted.png` / 意味: 輪(上下逆さま)

```
single warm muted gold spoked wagon wheel, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, upside down, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XLVIII 逆さの錨

保存するファイル名: `art/bus/anchor-inverted.png` / 意味: 錨(上下逆さま)

```
single warm muted gold anchor, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, upside down, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XLIX 翠の月

保存するファイル名: `art/bus/moon-emerald.png` / 意味: 月(物全体が翠色)

```
single emerald green crescent moon, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden moon, craters, dripping, stars, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### L 金の羽

保存するファイル名: `art/bus/feather-gold.png` / 意味: 羽(物がいつもより強く輝く金)

```
single radiant bright gold feather, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, strong golden glow, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LI 黒い杯

保存するファイル名: `art/bus/chalice-black.png` / 意味: 杯(黒く塗った物、ふちだけ金)

```
single matte black chalice, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, painted solid black with a thin gold edge, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden chalice, person, human figure, hood, cloak, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LII 黒い灯

保存するファイル名: `art/bus/lantern-black.png` / 意味: 灯(黒く塗った物、ふちだけ金)

```
single matte black lantern, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, painted solid black with a thin gold edge, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden lantern, person, human figure, hood, cloak, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LIII 蒼い砂時計

保存するファイル名: `art/bus/hourglass-azure.png` / 意味: 砂時計(物全体が蒼色)

```
single azure blue hourglass, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely azure blue, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden hourglass, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LIV 夜明けの輪

保存するファイル名: `art/bus/wheel-dawn.png` / 意味: 輪(背景の下4分の1が朝焼けの橙)

```
single warm muted gold spoked wagon wheel, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LV 翠の砂時計

保存するファイル名: `art/bus/hourglass-emerald.png` / 意味: 砂時計(物全体が翠色)

```
single emerald green hourglass, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden hourglass, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LVI 凍てる輪

保存するファイル名: `art/bus/wheel-frozen.png` / 意味: 輪(霜の結晶に覆われている)

```
single warm muted gold spoked wagon wheel, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, frozen, covered in frost crystals, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LVII 凍てる錨

保存するファイル名: `art/bus/anchor-frozen.png` / 意味: 錨(霜の結晶に覆われている)

```
single warm muted gold anchor, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, frozen, covered in frost crystals, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LVIII 燃える太陽

保存するファイル名: `art/bus/sun-burning.png` / 意味: 太陽(炎に包まれている)

```
single warm muted gold sun, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LIX 凍てる杖

保存するファイル名: `art/bus/wand-frozen.png` / 意味: 杖(霜の結晶に覆われている)

```
single warm muted gold magic staff, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, frozen, covered in frost crystals, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LX 紅い扉

保存するファイル名: `art/bus/door-crimson.png` / 意味: 扉(物全体が紅色)

```
single crimson red tall arched door with two panels, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely crimson red, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden arched door, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXI 翼ある星

保存するファイル名: `art/bus/star-winged.png` / 意味: 星(翼が生えている)

```
single warm muted gold star, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, with a pair of feathered wings, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LXII 真夜中の剣

保存するファイル名: `art/bus/sword-midnight.png` / 意味: 剣(背景が濃紺の夜空、白く小さな星)

```
single warm muted gold sword, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, deep navy night sky background with many tiny white stars, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
brown background, orange background, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXIII 鎖の矢

保存するファイル名: `art/bus/arrow-chained.png` / 意味: 矢(太い鎖が巻きつく)

```
single warm muted gold arrow, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, wrapped tightly in a heavy chain, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LXIV 蒼い雫

保存するファイル名: `art/bus/droplet-azure.png` / 意味: 雫(物全体が蒼色)

```
single azure blue teardrop-shaped water droplet, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely azure blue, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden water droplet, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXV 真夜中の灯

保存するファイル名: `art/bus/lantern-midnight.png` / 意味: 灯(背景が濃紺の夜空、白く小さな星)

```
single warm muted gold lantern, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, deep navy night sky background with many tiny white stars, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
brown background, orange background, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXVI 蒼い目

保存するファイル名: `art/bus/eye-azure.png` / 意味: 目(物全体が蒼色)

```
single azure blue open almond-shaped eye with a round iris, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely azure blue, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden eye, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXVII 夜明けの星

保存するファイル名: `art/bus/star-dawn.png` / 意味: 星(背景の下4分の1が朝焼けの橙)

```
single warm muted gold star, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXVIII 金の冠

保存するファイル名: `art/bus/crown-gold.png` / 意味: 冠(物がいつもより強く輝く金)

```
single radiant bright gold crown, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, strong golden glow, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LXIX 稲妻の太陽

保存するファイル名: `art/bus/sun-lightning.png` / 意味: 太陽(稲妻が走る)

```
single warm muted gold sun, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, crackling with stylized lightning bolts around it, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXX 鎖の炎

保存するファイル名: `art/bus/flame-chained.png` / 意味: 炎(太い鎖が巻きつく)

```
single warm muted gold flame, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, wrapped tightly in a heavy chain, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LXXI 紅い鍵

保存するファイル名: `art/bus/key-crimson.png` / 意味: 鍵(物全体が紅色)

```
single crimson red antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely crimson red, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden antique key, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXII 紅い杯

保存するファイル名: `art/bus/chalice-crimson.png` / 意味: 杯(物全体が紅色)

```
single crimson red chalice, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely crimson red, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden chalice, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXIII 稲妻の目

保存するファイル名: `art/bus/eye-lightning.png` / 意味: 目(稲妻が走る)

```
single warm muted gold open almond-shaped eye with a round iris, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, crackling with stylized lightning bolts around it, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LXXIV 逆さの矢

保存するファイル名: `art/bus/arrow-inverted.png` / 意味: 矢(上下逆さま)

```
single warm muted gold arrow, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, upside down, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LXXV 真夜中の炎

保存するファイル名: `art/bus/flame-midnight.png` / 意味: 炎(背景が濃紺の夜空、白く小さな星)

```
single warm muted gold flame, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, deep navy night sky background with many tiny white stars, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
brown background, orange background, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXVI 翼ある天秤

保存するファイル名: `art/bus/scales-winged.png` / 意味: 天秤(翼が生えている)

```
single warm muted gold balance scale with exactly two hanging pans, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, with a pair of feathered wings, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LXXVII 水晶の目

保存するファイル名: `art/bus/eye-crystal.png` / 意味: 目(透き通った水晶でできている)

```
single clear crystal open almond-shaped eye with a round iris, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, made of transparent faceted crystal, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden eye, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXVIII 夜明けの矢

保存するファイル名: `art/bus/arrow-dawn.png` / 意味: 矢(背景の下4分の1が朝焼けの橙)

```
single warm muted gold arrow, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXIX 紅い鐘

保存するファイル名: `art/bus/bell-crimson.png` / 意味: 鐘(物全体が紅色)

```
single crimson red bell, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely crimson red, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden bell, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXX 凍てる剣

保存するファイル名: `art/bus/sword-frozen.png` / 意味: 剣(霜の結晶に覆われている)

```
single warm muted gold sword, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, frozen, covered in frost crystals, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LXXXI 銀の星

保存するファイル名: `art/bus/star-silver.png` / 意味: 星(物全体が銀色)

```
single silver star, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely silver, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden star, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXXII 水晶の鐘

保存するファイル名: `art/bus/bell-crystal.png` / 意味: 鐘(透き通った水晶でできている)

```
single clear crystal bell, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, made of transparent faceted crystal, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden bell, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXXIII 紅い月

保存するファイル名: `art/bus/moon-crimson.png` / 意味: 月(物全体が紅色)

```
single crimson red crescent moon, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely crimson red, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden moon, craters, dripping, stars, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXXIV 真夜中の冠

保存するファイル名: `art/bus/crown-midnight.png` / 意味: 冠(背景が濃紺の夜空、白く小さな星)

```
single warm muted gold crown, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, deep navy night sky background with many tiny white stars, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
brown background, orange background, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXXV 銀の月

保存するファイル名: `art/bus/moon-silver.png` / 意味: 月(物全体が銀色)

```
single silver crescent moon, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely silver, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden moon, craters, dripping, stars, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXXVI 金の雫

保存するファイル名: `art/bus/droplet-gold.png` / 意味: 雫(物がいつもより強く輝く金)

```
single radiant bright gold teardrop-shaped water droplet, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, strong golden glow, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### LXXXVII 紅い砂時計

保存するファイル名: `art/bus/hourglass-crimson.png` / 意味: 砂時計(物全体が紅色)

```
single crimson red hourglass, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely crimson red, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden hourglass, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXXVIII 凍てる太陽

保存するファイル名: `art/bus/sun-frozen.png` / 意味: 太陽(霜の結晶に覆われている)

```
single warm muted gold sun, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, frozen, covered in frost crystals, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### LXXXIX 翠の雫

保存するファイル名: `art/bus/droplet-emerald.png` / 意味: 雫(物全体が翠色)

```
single emerald green teardrop-shaped water droplet, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden water droplet, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XC 黒い月

保存するファイル名: `art/bus/moon-black.png` / 意味: 月(黒く塗った物、ふちだけ金)

```
single matte black crescent moon, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, painted solid black with a thin gold edge, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden moon, person, human figure, hood, cloak, craters, dripping, stars, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XCI 翠の目

保存するファイル名: `art/bus/eye-emerald.png` / 意味: 目(物全体が翠色)

```
single emerald green open almond-shaped eye with a round iris, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden eye, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XCII 凍てる炎

保存するファイル名: `art/bus/flame-frozen.png` / 意味: 炎(霜の結晶に覆われている)

```
single warm muted gold flame, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, frozen, covered in frost crystals, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XCIII 真夜中の羽

保存するファイル名: `art/bus/feather-midnight.png` / 意味: 羽(背景が濃紺の夜空、白く小さな星)

```
single warm muted gold feather, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, deep navy night sky background with many tiny white stars, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
brown background, orange background, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XCIV 黒い星

保存するファイル名: `art/bus/star-black.png` / 意味: 星(黒く塗った物、ふちだけ金)

```
single matte black star, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, painted solid black with a thin gold edge, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden star, person, human figure, hood, cloak, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XCV 翼ある剣

保存するファイル名: `art/bus/sword-winged.png` / 意味: 剣(翼が生えている)

```
single warm muted gold sword, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, with a pair of feathered wings, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XCVI 夜明けの天秤

保存するファイル名: `art/bus/scales-dawn.png` / 意味: 天秤(背景の下4分の1が朝焼けの橙)

```
single warm muted gold balance scale with exactly two hanging pans, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XCVII 逆さの天秤

保存するファイル名: `art/bus/scales-inverted.png` / 意味: 天秤(上下逆さま)

```
single warm muted gold balance scale with exactly two hanging pans, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, upside down, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### XCVIII 銀の灯

保存するファイル名: `art/bus/lantern-silver.png` / 意味: 灯(物全体が銀色)

```
single silver lantern, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely silver, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden lantern, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### XCIX 銀の杯

保存するファイル名: `art/bus/chalice-silver.png` / 意味: 杯(物全体が銀色)

```
single silver chalice, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely silver, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden chalice, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### C 夜明けの羽

保存するファイル名: `art/bus/feather-dawn.png` / 意味: 羽(背景の下4分の1が朝焼けの橙)

```
single warm muted gold feather, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CI 水晶の輪

保存するファイル名: `art/bus/wheel-crystal.png` / 意味: 輪(透き通った水晶でできている)

```
single clear crystal spoked wagon wheel, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, made of transparent faceted crystal, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden wheel, text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CII 鎖の太陽

保存するファイル名: `art/bus/sun-chained.png` / 意味: 太陽(太い鎖が巻きつく)

```
single warm muted gold sun, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, wrapped tightly in a heavy chain, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CIII 鎖の杖

保存するファイル名: `art/bus/wand-chained.png` / 意味: 杖(太い鎖が巻きつく)

```
single warm muted gold magic staff, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, wrapped tightly in a heavy chain, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### CIV 水晶の太陽

保存するファイル名: `art/bus/sun-crystal.png` / 意味: 太陽(透き通った水晶でできている)

```
single clear crystal sun, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, made of transparent faceted crystal, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden sun, text, letters, numbers, watermark, logo, tarot card, card border, frame, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CV 水晶の錨

保存するファイル名: `art/bus/anchor-crystal.png` / 意味: 錨(透き通った水晶でできている)

```
single clear crystal anchor, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, made of transparent faceted crystal, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden anchor, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CVI 夜明けの冠

保存するファイル名: `art/bus/crown-dawn.png` / 意味: 冠(背景の下4分の1が朝焼けの橙)

```
single warm muted gold crown, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, very dark navy blue sky background, lower quarter glowing with orange sunrise, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
orange object, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CVII 翼ある灯

保存するファイル名: `art/bus/lantern-winged.png` / 意味: 灯(翼が生えている)

```
single warm muted gold lantern, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, with a pair of feathered wings, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### CVIII 蒼い鍵

保存するファイル名: `art/bus/key-azure.png` / 意味: 鍵(物全体が蒼色)

```
single azure blue antique key, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely azure blue, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden antique key, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CIX 黒い雫

保存するファイル名: `art/bus/droplet-black.png` / 意味: 雫(黒く塗った物、ふちだけ金)

```
single matte black teardrop-shaped water droplet, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, painted solid black with a thin gold edge, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden water droplet, person, human figure, hood, cloak, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CX 金の砂時計

保存するファイル名: `art/bus/hourglass-gold.png` / 意味: 砂時計(物がいつもより強く輝く金)

```
single radiant bright gold hourglass, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, strong golden glow, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### CXI 燃える目

保存するファイル名: `art/bus/eye-burning.png` / 意味: 目(炎に包まれている)

```
single warm muted gold open almond-shaped eye with a round iris, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### CXII 水晶の杖

保存するファイル名: `art/bus/wand-crystal.png` / 意味: 杖(透き通った水晶でできている)

```
single clear crystal magic staff, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, made of transparent faceted crystal, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden magic staff, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CXIII 真夜中の矢

保存するファイル名: `art/bus/arrow-midnight.png` / 意味: 矢(背景が濃紺の夜空、白く小さな星)

```
single warm muted gold arrow, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, art deco emblem, flat, symmetrical, deep navy night sky background with many tiny white stars, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
brown background, orange background, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CXIV 翠の羽

保存するファイル名: `art/bus/feather-emerald.png` / 意味: 羽(物全体が翠色)

```
single emerald green feather, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely emerald green, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden feather, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CXV 稲妻の扉

保存するファイル名: `art/bus/door-lightning.png` / 意味: 扉(稲妻が走る)

```
single warm muted gold tall arched door with two panels, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, crackling with stylized lightning bolts around it, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### CXVI 鎖の剣

保存するファイル名: `art/bus/sword-chained.png` / 意味: 剣(太い鎖が巻きつく)

```
single warm muted gold sword, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, wrapped tightly in a heavy chain, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### CXVII 逆さの炎

保存するファイル名: `art/bus/flame-inverted.png` / 意味: 炎(上下逆さま)

```
single warm muted gold flame, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, upside down, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### CXVIII 蒼い杯

保存するファイル名: `art/bus/chalice-azure.png` / 意味: 杯(物全体が蒼色)

```
single azure blue chalice, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, entirely azure blue, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
golden chalice, text, letters, numbers, watermark, logo, tarot card, card border, frame, circular frame, halo ring, bright background, cyan, multicolored, cluttered, texture, photorealistic, glossy, small object, off center
```

### CXIX 稲妻の杖

保存するファイル名: `art/bus/wand-lightning.png` / 意味: 杖(稲妻が走る)

```
single warm muted gold magic staff, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, crackling with stylized lightning bolts around it, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```

### CXX 燃える鐘

保存するファイル名: `art/bus/bell-burning.png` / 意味: 鐘(炎に包まれている)

```
single warm muted gold bell, the main subject, large and clearly recognizable, one single object only, centered, object fills most of the image, burning, wreathed in stylized flames, art deco emblem, flat, symmetrical, very dark navy blue background, almost black, solid flat color, subtle glow
```
